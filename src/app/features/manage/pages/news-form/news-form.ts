import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { NewsForm } from '../../../../core/models/manage.model';
import { ManageApiService } from '../../../../core/services/manage-api.service';
import { htmlToText, textToHtml, toManageError } from '../../manage.utils';

/** /manage/news/new (create) and /manage/news/:id (edit). The same form does both. */
@Component({
  selector: 'app-news-form',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './news-form.html',
  styleUrl: '../../manage-form.css',
})
export class NewsFormPage implements OnInit {
  private readonly manageApi = inject(ManageApiService);
  private readonly router = inject(Router);

  /** From the URL /manage/news/:id. Empty on /manage/news/new → create mode. */
  readonly id = input<string>();

  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  /** Same shape as NewsForm (title.en, title.ar, ...). Description is plain text here; HTML is made on save. */
  protected readonly form = new FormGroup({
    title: new FormGroup({
      en: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(150)] }),
      ar: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(150)] }),
    }),
    description: new FormGroup({
      en: new FormControl('', { nonNullable: true }),
      ar: new FormControl('', { nonNullable: true }),
    }),
  });

  ngOnInit(): void {
    const id = this.id();
    if (!id) return; // create mode: start empty

    // Edit mode: load BOTH languages from our API and fill the form.
    this.loading.set(true);
    this.manageApi.getNews(id).subscribe({
      next: (news) => {
        this.form.setValue({
          title: news.title,
          description: { en: htmlToText(news.description.en), ar: htmlToText(news.description.ar) },
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(toManageError(err));
        this.loading.set(false);
      },
    });
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // show the red borders + messages
      return;
    }

    const value = this.form.getRawValue();
    const body: NewsForm = {
      title: { en: value.title.en.trim(), ar: value.title.ar.trim() },
      description: { en: textToHtml(value.description.en), ar: textToHtml(value.description.ar) },
    };

    this.saving.set(true);
    this.error.set(null);

    const id = this.id();
    const request = id ? this.manageApi.updateNews(id, body) : this.manageApi.createNews(body);

    request.subscribe({
      next: () =>
        this.router.navigate(['/manage'], {
          queryParams: { tab: 'news' },
          state: { notice: id ? 'manage.updated' : 'manage.created' },
        }),
      error: (err) => {
        this.error.set(toManageError(err));
        this.saving.set(false);
      },
    });
  }
}
