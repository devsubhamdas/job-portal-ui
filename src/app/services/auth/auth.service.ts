import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { LoginGQL, LogoutGQL, MeGQL, SignupGQL } from '../../../generated/operations';
import { LoginInput, SignupInput } from '../../../generated/schema';
import { firstValueFrom, tap, timeout } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly authLoading = signal(true);
  readonly user = signal<
    { id: string; name: string; email: string; role: string } | null | undefined
  >(undefined);
  private loginGQL = inject(LoginGQL);
  private logoutGQL = inject(LogoutGQL);
  private meGQL = inject(MeGQL);
  private signupGQL = inject(SignupGQL);

  private platformId = inject(PLATFORM_ID);

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
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const result = await firstValueFrom(this.meGQL.fetch().pipe(timeout(8000)));
      this.user.set(result.data?.me ?? null);
    } catch (err) {
      this.user.set(null);
    } finally {
      this.authLoading.set(false);
    }
  }
}
