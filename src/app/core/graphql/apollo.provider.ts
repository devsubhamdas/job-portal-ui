import { inject } from '@angular/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

export const apolloProvider = provideApollo(() => {
  const httpLink = inject(HttpLink);

  return {
    link: httpLink.create({
      uri: 'http://localhost:8081/graphql',
    }),
    cache: new InMemoryCache(),
  };
});
