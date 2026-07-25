import { inject, PLATFORM_ID, REQUEST } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { HttpHeaders } from '@angular/common/http';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { OperationTypeNode } from 'graphql';

export const apolloProvider = provideApollo(() => {
  const $httpLink = inject(HttpLink);
  const platformId = inject(PLATFORM_ID);
  const request = inject(REQUEST, { optional: true });
  const isServer = isPlatformServer(platformId);
  const isBrowser = isPlatformBrowser(platformId);
  const cookie = request?.headers.get('cookie') ?? null;
  const headers = isServer && cookie ? new HttpHeaders({ cookie }) : undefined;

  const httpLink = $httpLink.create({
    uri: 'http://localhost:8080/graphql',
    withCredentials: true,
    headers,
  });

  const splitLink = isBrowser ? createSplitLink() : null;

  function createSplitLink() {
    const wsLink = new GraphQLWsLink(
      createClient({
        url: 'ws://localhost:8080/graphql',
        connectionParams: async () => {
          return {
            // Optional authentication
            // authorization: token
          };
        },
      }),
    );

    return ApolloLink.split(
      ({ operationType }) => operationType === OperationTypeNode.SUBSCRIPTION,
      wsLink,
      httpLink,
    );
  }

  return {
    link: splitLink ?? httpLink,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            searchJobs: {
              keyArgs: ['input', ['query']],
              merge(existing, incoming, { args }) {
                const cursor = args?.['input']?.cursor;
                // Fresh search
                if (!cursor || !existing) {
                  return incoming;
                }

                return {
                  ...incoming,
                  data: [...existing.data, ...incoming.data],
                };
              },
            },
            ownedJobs: {
              merge(_, incoming) {
                return incoming;
              },
            },
            appliedJobs: {
              merge(_, incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
  };
});
