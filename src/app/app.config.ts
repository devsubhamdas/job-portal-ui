import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { registerLocaleData } from '@angular/common';
import localeIn from '@angular/common/locales/en-IN';
import { apolloProvider } from './core/graphql/apollo.provider';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AuthService } from './services/auth/auth.service';

registerLocaleData(localeIn);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    apolloProvider,
    provideAppInitializer(() => {
      const auth = inject(AuthService);
      return auth.loadCurrentUser();
    }),
    { provide: LOCALE_ID, useValue: 'en-IN' },
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
      ripple: true,
    }),
  ],
};
