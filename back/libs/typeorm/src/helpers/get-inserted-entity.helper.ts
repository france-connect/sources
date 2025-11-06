import type { InsertResult } from 'typeorm';

import { TypeormNoInsertedEntityException } from '../exceptions';

/**
 * Returns the inserted entity from the InsertResult of a Postgres insert.
 * Only supports single-row inserts with RETURNING.
 */
export function getInsertedEntity<T>(result: InsertResult): T {
  const first = result.raw?.[0];

  if (!first) {
    throw new TypeormNoInsertedEntityException();
  }

  return first as T;
}
