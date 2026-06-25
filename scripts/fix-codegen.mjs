// scripts/fix-codegen.mjs
import { readFileSync, writeFileSync } from 'fs';

const file = 'src/generated/graphql.ts';
let content = readFileSync(file, 'utf-8');

// remove duplicate type blocks that operations plugin re-emits
content = content.replace(/export type JobType =\s*\n(\s*\|[^\n]+\n)+\n/g, '');
content = content.replace(/export type SearchJobsInput = \{[^}]+\};\n\n/g, '');

writeFileSync(file, content);
console.log('✓ Removed duplicate types from generated file');
