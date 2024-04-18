/* istanbul ignore file */

// Declarative file
import { RequireAtLeastOne } from 'type-fest';

interface pluralEntry {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other?: string;
}

export interface I18nComplexTermInterface {
  term: string;
  definition: RequireAtLeastOne<
    pluralEntry,
    'zero' | 'one' | 'two' | 'few' | 'many' | 'other'
  >;
}
