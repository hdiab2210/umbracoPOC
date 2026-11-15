import { Component, computed, inject, input, linkedSignal, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { AppRole, ManagedMember } from '../../../../core/models/manage.model';
import { EventItemContent, NewsItemContent } from '../../../../core/models/umbraco.models';
import { LocalDatePipe } from '../../../../core/pipes/local-date.pipe';
import { ApiService } from '../../../../core/services/api.service';
import { ManageApiService } from '../../../../core/services/manage-api.service';
import { authFeature } from '../../../../core/state/auth/auth.feature';
import { languageFeature } from '../../../../core/state/language/language.feature';
import { isUpcoming } from '../../../../core/utils/event.utils';
import { toManageError } from '../../manage.utils';

export type ManageTab = 'news' | 'events' | 'members';

/** /manage: tabs with all news and events, and buttons to create, edit and delete. */
@Component({
  selector: 'app-manage-dashboard',
  imports: [RouterLink, TranslatePipe, LocalDatePipe],
  templateUrl: './manage-dashboard.html',
  styleUrl: './manage-dashboard.css',
})
export class ManageDashboardPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly manageApi = inject(ManageApiService);
  private readonly translate = inject(TranslateService);
  private readonly store = inject(Store);

  protected readonly language = this.store.selectSignal(languageFeature.selectCurrent);
  protected readonly member = this.store.selectSignal(authFeature.selectMember);
  /** Admins: true → Delete buttons shown. Editors: false → hidden (the server also refuses with 403). */
  protected readonly canDelete = this.store.selectSignal(authFeature.selectCanDelete);
  /** Admins only: the Members tab (change roles). */
  protected readonly isAdmin = this.store.selectSignal(authFeature.selectIsAdmin);

  /** ?tab=events / ?tab=members in the URL opens that tab. */
  readonly tabParam = input<string>(undefined, { alias: 'tab' });
  /** The open tab. Starts from the URL, then the user can switch it. Non-admins can never open "members". */
  protected readonly tab = linkedSignal<ManageTab>(() => {
    const fromUrl = this.tabParam();
    if (fromUrl === 'events') return 'events';
    if (fromUrl === 'members' && this.isAdmin()) return 'members';
    return 'news';
  });

  /** The three roles, in the order shown in the dropdown. */
  protected readonly roles: AppRole[] = ['member', 'editor', 'admin'];
  protected readonly members = signal<ManagedMember[]>([]);
  protected readonly membersLoading = signal(false);
  /** id of the member whose role is being saved (to disable their dropdown). */
  protected readonly savingMemberId = signal<string | null>(null);
  /** Values for the notice text, e.g. { name: 'Sara', role: 'Editor' }. */
  protected readonly noticeParams = signal<Record<string, string>>({});

  protected readonly news = signal<NewsItemContent[]>([]);
  protected readonly events = signal<EventItemContent[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  /** Message shown after a save / delete, e.g. "Saved". */
  protected readonly notice = signal<string | null>(
    (inject(Router).currentNavigation()?.extras.state?.['notice'] as string | undefined) ?? null,
  );
  /** id of the row being deleted (to disable its button). */
  protected readonly deletingId = signal<string | null>(null);

  // Arrow function on purpose: .filter(isUpcoming) would pass the array INDEX as isUpcoming's 2nd parameter (now).
  protected readonly upcomingCount = computed(() => this.events().filter((event) => isUpcoming(event)).length);

  ngOnInit(): void {
    this.reload();
    if (this.isAdmin()) this.loadMembers();
  }

  // ================= MEMBERS TAB (admin only) =================

  protected loadMembers(): void {
    this.membersLoading.set(true);
    this.manageApi.getMembers().subscribe({
      next: (list) => {
        this.members.set(list);
        this.membersLoading.set(false);
      },
      error: (err) => {
        this.error.set(toManageError(err));
        this.membersLoading.set(false);
      },
    });
  }

  /** Called when the admin picks a new role in a member's dropdown. */
  protected changeRole(target: ManagedMember, select: HTMLSelectElement): void {
    const newRole = select.value as AppRole;
    if (newRole === target.role) return;

    const roleName = this.translate.instant(`manage.roles.${newRole}`);

    // Giving admin rights is a big step: ask first. If cancelled, put the dropdown back.
    if (newRole === 'admin' && !confirm(this.translate.instant('manage.confirmMakeAdmin', { name: target.name }))) {
      select.value = target.role;
      return;
    }

    this.savingMemberId.set(target.id);
    this.notice.set(null);
    this.error.set(null);

    this.manageApi.setMemberRole(target.id, newRole).subscribe({
      next: () => {
        // Update only this row in the list.
        this.members.update((list) => list.map((m) => (m.id === target.id ? { ...m, role: newRole } : m)));
        this.savingMemberId.set(null);
        this.noticeParams.set({ name: target.name, role: roleName });
        this.notice.set('manage.roleChanged');
      },
      error: (err) => {
        select.value = target.role; // the save failed → show the old role again
        this.savingMemberId.set(null);
        this.error.set(toManageError(err));
      },
    });
  }

  /** "Sara Editor" → "SE" for the avatar circle. */
  protected initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]!.toUpperCase())
      .join('');
  }

  protected reload(): void {
    this.loading.set(true);
    this.error.set(null);
    let pending = 2;
    const done = () => --pending === 0 && this.loading.set(false);

    // Lists come from the normal Delivery API (published content, in the current language).
    this.api.getNewsItems().subscribe({
      next: (items) => this.news.set(items),
      error: (err) => { this.error.set(toManageError(err)); done(); },
      complete: done,
    });
    this.api.getEventItems().subscribe({
      next: (items) => this.events.set(items),
      error: (err) => { this.error.set(toManageError(err)); done(); },
      complete: done,
    });
  }

  protected isPast(item: EventItemContent): boolean {
    return !isUpcoming(item);
  }

  protected deleteNews(item: NewsItemContent): void {
    this.confirmAndDelete(item, this.manageApi.deleteNews(item.id), () =>
      this.news.update((list) => list.filter((n) => n.id !== item.id)),
    );
  }

  protected deleteEvent(item: EventItemContent): void {
    this.confirmAndDelete(item, this.manageApi.deleteEvent(item.id), () =>
      this.events.update((list) => list.filter((e) => e.id !== item.id)),
    );
  }

  /** Ask first; on success remove the row from the table (no need to reload everything). */
  private confirmAndDelete(
    item: NewsItemContent | EventItemContent,
    request: Observable<void>,
    removeRow: () => void,
  ): void {
    const title = item.properties.title || item.name;
    if (!confirm(this.translate.instant('manage.confirmDelete', { title }))) return;

    this.deletingId.set(item.id);
    this.notice.set(null);
    this.error.set(null);

    request.subscribe({
      next: () => {
        removeRow();
        this.deletingId.set(null);
        this.noticeParams.set({});
        this.notice.set('manage.deleted');
      },
      error: (err) => {
        this.deletingId.set(null);
        this.error.set(toManageError(err));
      },
    });
  }
}
