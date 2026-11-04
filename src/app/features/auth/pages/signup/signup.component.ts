import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { authFeature } from '../../../../core/state/auth/auth.feature';
import { AuthActions } from '../../../../core/state/auth/auth.actions';


@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './signup.component.html',
  styleUrl: '../auth-form.css',
})
export class Signup {
  private readonly store = inject(Store);

  protected readonly loading = this.store.selectSignal(authFeature.selectLoading);
  protected readonly error = this.store.selectSignal(authFeature.selectError);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(10)]], // same rule as Umbraco
  });

  constructor() {
    this.store.dispatch(AuthActions.clearError());
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // show the field errors
      return;
    }
    this.store.dispatch(AuthActions.register({ request: this.form.getRawValue() }));
  }
}