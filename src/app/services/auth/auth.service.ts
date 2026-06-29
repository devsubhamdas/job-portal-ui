import { inject, Injectable, signal } from '@angular/core';
import { LoginGQL, LogoutGQL, MeGQL } from '../../../generated/operations';
import { LoginInput } from '../../../generated/schema';
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
