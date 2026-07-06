import { inject, Injectable, signal } from '@angular/core';
import { LoginGQL, LogoutGQL, MeGQL, SignupGQL } from '../../../generated/operations';
import { LoginInput, SignupInput } from '../../../generated/schema';
import { firstValueFrom, tap } from 'rxjs';

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

  async loadCurrentUser(): Promise<void> {
    this.authLoading.set(true);

    try {
      const result = await firstValueFrom(this.meGQL.fetch());
      if (result.data) {
        this.user.set(result.data.me);
      }
    } catch (err) {
      this.user.set(null);
    } finally {
      this.authLoading.set(false);
    }
  }
}
