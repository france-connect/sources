import { TransformFnParams } from 'class-transformer';
import { mocked } from 'jest-mock';

import { parseBoolean } from '../helpers';
import { enforceBoolean } from './enforce-boolean.transform';

jest.mock('../helpers');

describe('Enforce boolean transform from string', () => {
  describe('enforceBoolean', () => {
    const parsedBooleanMocked = mocked(parseBoolean);

    it('should return the value returned by parseBoolean', () => {
      // Given
      const returnedValue = Symbol() as unknown as boolean;
      const options = { value: 'false' } as TransformFnParams;
      parsedBooleanMocked.mockReturnValue(returnedValue);

      // When
      const result = enforceBoolean(options);

      // Then
      expect(result).toBe(returnedValue);
    });
  });
});
