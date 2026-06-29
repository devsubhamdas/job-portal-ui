import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return toObservable(auth.authLoading).pipe(
    filter((loading) => !loading),
    take(1),
    map(() => {
      return auth.user() ? true : router.createUrlTree(['/']);
    }),
  );
};
