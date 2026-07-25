import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AutoFocusModule } from 'primeng/autofocus';
import { SelectModule } from 'primeng/select';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface Role {
  label: string;
  value: string;
}

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
    AutoFocusModule,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup implements OnInit {
  signupForm: FormGroup;
  roleOptions: Role[] = [];
  formSubmitAttempted: boolean = false;
  signupError = signal<{ field: string; message: string } | null>(null);
  signupInProgress = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private destroyRef: DestroyRef,
  ) {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        cPassword: ['', [Validators.required]],
        role: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  ngOnInit(): void {
    this.roleOptions = [
      {
        label: 'Admin',
        value: 'ADMIN',
      },
      {
        label: 'User',
        value: 'USER',
      },
    ];
  }

  onSubmit(event: SubmitEvent) {
    this.formSubmitAttempted = true;
    if (this.signupForm.invalid) {
      return;
    }

    const { name, email, password, role } = this.signupForm.getRawValue();
    const payload = { name, email, password, role };
    this.signupInProgress.set(true);

    this.authService
      .signup(payload)
      .pipe(
        finalize(() => this.signupInProgress.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          if (result.data) {
            // console.log(result.data);
            this.signupError.set(null);
            this.router.navigate(['/']);
          }
          if (result.error) {
            console.error(result.error);
          }
        },
        error: (err) => {
          console.error(err);
          if (
            err.errors?.[0]?.message.includes('Unique constraint failed on the fields: (`email`)')
          ) {
            this.signupError.set({
              field: 'email',
              message: 'Email already exists',
            });
          }
        },
      });
  }

  isInvalid(controlName: string) {
    const control = this.signupForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitAttempted);
  }

  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('cPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get name() {
    return this.signupForm.controls['name'];
  }
  get email() {
    return this.signupForm.controls['email'];
  }
  get password() {
    return this.signupForm.controls['password'];
  }
  get cPassword() {
    return this.signupForm.controls['cPassword'];
  }
  get role() {
    return this.signupForm.controls['role'];
  }
}
