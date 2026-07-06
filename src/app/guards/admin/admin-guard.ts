import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // return toObservable(auth.authLoading).pipe(
  //   filter((loading) => !loading),
  //   take(1),
  //   map(() => {
  //     const user = auth.user();

  //     if (!user) {
  //       return router.createUrlTree(['/']);
  //     }

  //     return user.role === 'ADMIN' ? true : router.createUrlTree(['/']);
  //   }),
  // );
  const user = auth.user();

  if (!user) {
    return router.createUrlTree(['/']);
  }
  return user.role === 'ADMIN' ? true : router.createUrlTree(['/']);
};
