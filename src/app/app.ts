import {
  Component,
  computed,
  DestroyRef,
  effect,
  HostListener,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterOutlet, Router, RouterLinkWithHref } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Popover, PopoverModule } from 'primeng/popover';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { ToastModule } from 'primeng/toast';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LoginDialogService } from './services/login-dialog/login-dialog.service';
import { JobService } from './services/job/job.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JobCreatedSubscription } from '../generated/operations';

type Job = JobCreatedSubscription['jobCreated'];

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    MenubarModule,
    MenuModule,
    ButtonModule,
    DialogModule,
    PasswordModule,
    InputTextModule,
    AutoFocusModule,
    PopoverModule,
    PanelModule,
    ToastModule,
    ConfirmDialogModule,
    RouterLinkWithHref,
    CommonModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('client');
  navbarItems = computed<MenuItem[]>(() => {
    const user = this.authService.user();
    return [
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
        visible: !!user,
        routerLink: ['/applications'],
        routerLinkActiveOptions: {
          exact: false,
        },
      },
      {
        label: 'Admin',
        icon: 'pi pi-user',
        visible: user?.role === 'ADMIN',
        routerLink: ['/admin'],
        routerLinkActiveOptions: {
          exact: false,
        },
      },
    ];
  });

  profileMenuItems: MenuItem[] | undefined;
  loginDialogVisibility: typeof this.loginDialogService.visible;
  loginForm: FormGroup;
  formSubmitAttempted = false;
  loginInProgress = signal<boolean>(false);
  readonly authUser: typeof this.authService.user;
  loginError = signal<{ field: string; message: string } | null>(null);

  newJobPostList = signal<Job[]>([]);

  private scheduled = false;
  @ViewChild('notification_op') notificationOp!: Popover;
  @HostListener('window:scroll')
  onWindowScroll() {
    if (!this.notificationOp.overlayVisible || this.scheduled) {
      return;
    }
    this.scheduled = true;
    requestAnimationFrame(() => {
      this.notificationOp.align();
      this.scheduled = false;
    });
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private jobService: JobService,
    private loginDialogService: LoginDialogService,
    private destroyRef: DestroyRef,
  ) {
    this.authUser = this.authService.user;
    this.loginDialogVisibility = this.loginDialogService.visible;
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.profileMenuItems = [
      {
        label: 'Account',
        items: [
          { label: 'Profile', icon: 'pi pi-address-book' },
          { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.onLogout() },
        ],
      },
    ];

    this.listenForJobCreatedEvent();
  }

  // Handle Login
  onLogin(event: SubmitEvent) {
    this.formSubmitAttempted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.loginInProgress.set(true);
    const payload = this.loginForm.value;
    this.authService.login(payload).subscribe({
      next: (result) => {
        if (typeof result.loading === 'boolean') this.loginInProgress.set(result.loading);
        if (result.error) console.error(result.error);
        this.loginDialogService.close();
        this.loginError.set(null);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        this.loginInProgress.set(false);
        if (String(err.message).match('invalid email')) {
          this.loginError.set({
            field: 'email',
            message: 'Invalid Email',
          });
        }
        if (String(err.message).match('invalid password')) {
          this.loginError.set({
            field: 'password',
            message: 'Invalid Password',
          });
        }
      },
    });
  }

  // Handle Logout
  onLogout() {
    this.authService.logout().subscribe({
      next: (result) => {
        if (result.data?.logout === true) this.router.navigate(['/']);
        if (result.error) console.error(result.error);
      },
      error: (err) => console.error(err),
    });
  }

  listenForJobCreatedEvent() {
    this.jobService
      .jobCreated()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ data }) => {
          if (data) this.newJobPostList.update((prev) => [data, ...prev]);
        },
        error: (err) => console.error(err),
      });
  }

  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  showLoginDialog() {
    this.loginDialogService.open();
  }

  onDialogHide() {
    this.formSubmitAttempted = false;
    this.loginError.set(null);
    this.loginForm.reset();
    // this.loginForm.markAsPristine();
    // this.loginForm.markAsUntouched();
  }

  onActionCreate(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.loginDialogService.close();
    this.loginError.set(null);

    setTimeout(() => {
      this.loginForm.reset();
      this.router.navigate(['/signup']);
    });
  }
}
