import { inject, Injectable, signal } from '@angular/core';
import { LoginGQL, LogoutGQL, MeGQL, SignupGQL } from '../../../generated/operations';
import { LoginInput, SignupInput } from '../../../generated/schema';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly authLoading = signal(true);
  readonly user = signal<{ id: string; name: string; email: string; role: string } | null>(null);
  private loginGQL = inject(LoginGQL);
  private logoutGQL = inject(LogoutGQL);
  private meGQL = inject(MeGQL);
  private signupGQL = inject(SignupGQL);

  constructor() {
    this.loadCurrentUser();
  }

  login(payload: LoginInput) {
    return this.loginGQL.mutate({ variables: { input: payload } }).pipe(
      tap((result) => {
        if (result.data) this.user.set(result.data.login);
      }),
    );
  }

  logout() {
    return this.logoutGQL.mutate().pipe(
      tap((result) => {
        if (result.data?.logout === true) this.user.set(null);
      }),
    );
  }

  signup(payload: SignupInput) {
    return this.signupGQL.mutate({ variables: { input: payload } }).pipe(
      tap((result) => {
        if (result.data) this.user.set(result.data.signup);
      }),
    );
  }

  private loadCurrentUser() {
    this.meGQL.fetch().subscribe({
      next: (result) => {
        if (result.data) {
          this.user.set(result.data.me);
        } else {
          this.user.set(null);
        }
        this.authLoading.set(false);
      },
      error: () => {
        this.user.set(null);
        this.authLoading.set(false);
      },
    });
  }
}
