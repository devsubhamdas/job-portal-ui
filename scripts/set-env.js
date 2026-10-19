// for production only
// run before build command

import fs from 'node:fs';
import path from 'node:path';

const http = process.env.GRAPHQL_HTTP_URI;
const ws = process.env.GRAPHQL_WS_URI;
if (!http || !ws) {
  console.error('Missing GRAPHQL_HTTP_URI or GRAPHQL_WS_URI');
  process.exit(1);
}

const content = `export const environment = {
  production: true,
  graphqlHttpUri: '${http}',
  graphqlWsUri: '${ws}',
};
`;

const file = path.join(__dirname, '..', 'src', 'environments', 'environment.ts');
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, content);
console.log('Wrote', file);
