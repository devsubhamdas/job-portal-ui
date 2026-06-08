import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, Router, RouterLinkWithHref } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AutoFocusModule } from 'primeng/autofocus';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    MenubarModule,
    ButtonModule,
    DialogModule,
    PasswordModule,
    InputTextModule,
    AutoFocusModule,
    RouterLinkWithHref,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('client');
  items: MenuItem[] | undefined;
  loginDialogVisibility: boolean = false;
  loginForm: FormGroup;
  formSubmitAttempted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Job Search',
        icon: 'pi pi-briefcase',
        routerLink: [''],
        routerLinkActiveOptions: {
          exact: true,
        },
      },
      {
        label: 'Applications',
        icon: 'pi pi-envelope',
        routerLink: ['/applications'],
        routerLinkActiveOptions: {
          exact: false,
        },
      },
      {
        label: 'Admin',
        icon: 'pi pi-user',
        routerLink: ['/admin'],
        routerLinkActiveOptions: {
          exact: false,
        },
      },
    ];
  }

  onSubmit(event: SubmitEvent) {
    this.formSubmitAttempted = true;
    if (this.loginForm.invalid) {
      return;
    }

    console.log(this.loginForm.value);
  }

  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  showLoginDialog() {
    this.loginDialogVisibility = true;
  }

  onDialogHide() {
    this.formSubmitAttempted = false;
    this.loginForm.reset();
    // this.loginForm.markAsPristine();
    // this.loginForm.markAsUntouched();
  }

  onActionCreate(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.loginDialogVisibility = false;

    setTimeout(() => {
      this.loginForm.reset();
      this.router.navigate(['/signup']);
    });
  }
}
