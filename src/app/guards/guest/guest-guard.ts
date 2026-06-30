import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return toObservable(auth.authLoading).pipe(
    filter((loading) => !loading),
    take(1),
    map(() => {
      return auth.user() ? router.createUrlTree(['/']) : true;
    }),
  );
};
