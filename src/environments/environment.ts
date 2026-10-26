// environment.ts (prod)
export const environment = {
  production: true,
  graphqlHttpUri: import.meta.env['NG_APP_GRAPHQL_HTTP_URI'],
  graphqlWsUri: import.meta.env['NG_APP_GRAPHQL_WS_URI'],
};
