import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { filter, firstValueFrom } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';

export const guestGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) return true;

  // Wait until the initial `me` request has finished
  await firstValueFrom(toObservable(auth.authLoading).pipe(filter((loading) => !loading)));

  return auth.user() ? router.createUrlTree(['/']) : true;
};
