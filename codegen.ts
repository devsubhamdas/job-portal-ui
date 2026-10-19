import type { CodegenConfig } from '@graphql-codegen/cli';
import 'dotenv/config';

const config: CodegenConfig = {
  schema:
    process.env.ENV === 'production'
      ? process.env.GRAPHQL_HTTP_URI
      : 'http://localhost:8080/graphql',
  documents: ['src/**/*.graphql'],
  generates: {
    'src/generated/schema.ts': {
      plugins: ['typescript'],
    },
    'src/generated/operations.ts': {
      plugins: ['typescript-operations', 'typescript-apollo-angular'],
      config: {
        importSchemaTypesFrom: './src/generated/schema',
        useTypeImports: true,
        addExplicitOverride: true,
        enumsAsTypes: true,
        scalars: {
          DateTime: 'Date',
        },
      },
    },
  },
};

export default config;
