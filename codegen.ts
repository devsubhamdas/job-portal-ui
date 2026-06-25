import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:8081/graphql',
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
      },
    },
  },
};

export default config;
