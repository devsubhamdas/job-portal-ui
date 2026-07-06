import { inject, PLATFORM_ID, REQUEST } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { HttpHeaders } from '@angular/common/http';

export const apolloProvider = provideApollo(() => {
  const httpLink = inject(HttpLink);
  const platformId = inject(PLATFORM_ID);
  const request = inject(REQUEST, { optional: true });
  const isServer = isPlatformServer(platformId);
  const cookie = isServer ? request?.headers.get('cookie') : null;

  return {
    link: httpLink.create({
      uri: 'http://localhost:8081/graphql',
      withCredentials: true,
      headers: cookie ? new HttpHeaders({ cookie }) : undefined,
    }),
    cache: new InMemoryCache(),
  };
});
