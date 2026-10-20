import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { filter, firstValueFrom } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

export const guestGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Wait until the initial `me` request has finished
  await firstValueFrom(toObservable(auth.authLoading).pipe(filter((loading) => !loading)));

  return auth.user() ? router.createUrlTree(['/']) : true;
};
