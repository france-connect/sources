import type { SchemaFieldType } from '../../types';
import { parseInitialValues } from './parse-initial-values.helper';

describe('parseInitialValues', () => {
  // Given
  const schemaMock = [
    { initialValue: 'hello world !', name: 'Jane' },
    { initialValue: false, name: 'Jack' },
    { initialValue: ['any', 'string', 'array'], name: 'Jolene' },
    { initialValue: 123, name: 'John' },
    { initialValue: { a: 1, b: 3, c: 2 }, name: 'James' },
  ] as SchemaFieldType[];

  it('should return an empty object when schema is undefined', () => {
    // When
    const result = parseInitialValues(undefined, {});

    // Then
    expect(result).toEqual({});
  });

  it('should return the initialValues, when no values are provided', () => {
    // When
    const result = parseInitialValues(schemaMock, {});

    // Then
    expect(result).toEqual({
      Jack: false,
      James: { a: 1, b: 3, c: 2 },
      Jane: 'hello world !',
      John: 123,
      Jolene: ['any', 'string', 'array'],
    });
  });

  it('should return the initialValues, when values are provided', () => {
    // When
    const result = parseInitialValues(schemaMock, {
      Jack: true,
      James: { a: 3, c: { d: 'e', f: 'g' } },
      Jane: 'hello world updated !',
      John: undefined,
      Jolene: ['mock', 'values'],
    });

    // Then
    expect(result).toEqual({
      Jack: true,
      James: { a: 3, c: { d: 'e', f: 'g' } },
      Jane: 'hello world updated !',
      John: undefined,
      Jolene: ['mock', 'values'],
    });
  });

  it('should return the an empty object, when values do not have any initial value', () => {
    // When
    const result = parseInitialValues(
      [{ name: 'Jolene' }, { name: 'John' }, { name: 'James' }] as SchemaFieldType[],
      {
        James: { a: 3, c: { d: 'e', f: 'g' } },
        John: undefined,
        Jolene: ['mock', 'values'],
      },
    );

    // Then
    expect(result).toEqual({});
  });
});
