import { InsertResult } from 'typeorm';

import { TypeormNoInsertedEntityException } from '../exceptions';
import { getInsertedEntity } from './get-inserted-entity.helper';

describe('getInsertedEntity', () => {
  it('should return the inserted entity from the InsertResult', () => {
    // Given
    const entity = { id: 1, name: 'Test Entity' };
    const insertResult = {
      raw: [entity],
    } as InsertResult;

    // When
    const result = getInsertedEntity(insertResult);

    // Then
    expect(result).toBe(entity);
  });

  it('should throw NoInsertedEntityException if no entity is returned', () => {
    // Given
    const insertResult = { raw: [] } as InsertResult;

    // When / Then
    expect(() => getInsertedEntity(insertResult)).toThrow(
      TypeormNoInsertedEntityException,
    );
  });
});
