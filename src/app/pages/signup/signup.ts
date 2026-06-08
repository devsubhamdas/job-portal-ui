import { Component, OnInit } from '@angular/core';
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

interface Role {
  name: string;
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
  roles: Role[] = [];
  formSubmitAttempted: boolean = false;

  constructor(private fb: FormBuilder) {
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
    this.roles = [
      {
        name: 'Admin',
        value: 'ADMIN',
      },
      {
        name: 'User',
        value: 'USER',
      },
    ];
  }

  onSubmin(event: SubmitEvent) {
    this.formSubmitAttempted = true;
    if (this.signupForm.invalid) {
      return;
    }

    console.log(this.signupForm.value);
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
