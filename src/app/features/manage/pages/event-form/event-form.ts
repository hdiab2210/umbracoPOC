import { Component, inject, input, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { EventForm } from '../../../../core/models/manage.model';
import { ManageApiService } from '../../../../core/services/manage-api.service';
import { htmlToText, textToHtml, toInputDate, toManageError } from '../../manage.utils';

/** Form-level check: the end must not be before the start. */
function endAfterStart(group: AbstractControl): ValidationErrors | null {
  const { startDate, endDate } = group.value as { startDate: string; endDate: string };
  return startDate && endDate && endDate < startDate ? { endBeforeStart: true } : null;
}

/** /manage/events/new (create) and /manage/events/:id (edit). */
@Component({
  selector: 'app-event-form',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './event-form.html',
  styleUrl: '../../manage-form.css',
})
export class EventFormPage implements OnInit {
  private readonly manageApi = inject(ManageApiService);
  private readonly router = inject(Router);

  /** From the URL /manage/events/:id. Empty on /manage/events/new → create mode. */
  readonly id = input<string>();

  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  /** true when the loaded event is already over → read-only (past events can only be deleted). */
  protected readonly isPast = signal(false);

  protected readonly form = new FormGroup(
    {
      title: new FormGroup({
        en: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(150)] }),
        ar: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(150)] }),
      }),
      location: new FormGroup({
        en: new FormControl('', { nonNullable: true }),
        ar: new FormControl('', { nonNullable: true }),
      }),
      // "2026-11-18T09:00", the value format of <input type="datetime-local">
      startDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      endDate: new FormControl('', { nonNullable: true }),
      description: new FormGroup({
        en: new FormControl('', { nonNullable: true }),
        ar: new FormControl('', { nonNullable: true }),
      }),
    },
    { validators: endAfterStart },
  );

  ngOnInit(): void {
    const id = this.id();
    if (!id) return;

    this.loading.set(true);
    this.manageApi.getEvent(id).subscribe({
      next: (event) => {
        this.form.setValue({
          title: event.title,
          location: event.location,
          startDate: toInputDate(event.startDate),
          endDate: toInputDate(event.endDate),
          description: { en: htmlToText(event.description.en), ar: htmlToText(event.description.ar) },
        });

        // Same rule as the server and the dashboard: past = end (or start) is before now.
        const end = event.endDate ?? event.startDate;
        if (end && new Date(end).getTime() < Date.now()) {
          this.isPast.set(true);
          this.form.disable(); // every input becomes read-only
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(toManageError(err));
        this.loading.set(false);
      },
    });
  }

  protected save(): void {
    if (this.isPast()) return; // safety net: the button is hidden anyway
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const body: EventForm = {
      title: { en: value.title.en.trim(), ar: value.title.ar.trim() },
      location: { en: value.location.en.trim(), ar: value.location.ar.trim() },
      // Sent exactly as typed (no toISOString(), which would shift the time to UTC).
      startDate: value.startDate,
      endDate: value.endDate || null,
      description: { en: textToHtml(value.description.en), ar: textToHtml(value.description.ar) },
    };

    this.saving.set(true);
    this.error.set(null);

    const id = this.id();
    const request = id ? this.manageApi.updateEvent(id, body) : this.manageApi.createEvent(body);

    request.subscribe({
      next: () =>
        this.router.navigate(['/manage'], {
          queryParams: { tab: 'events' },
          state: { notice: id ? 'manage.updated' : 'manage.created' },
        }),
      error: (err) => {
        this.error.set(toManageError(err));
        this.saving.set(false);
      },
    });
  }
}
