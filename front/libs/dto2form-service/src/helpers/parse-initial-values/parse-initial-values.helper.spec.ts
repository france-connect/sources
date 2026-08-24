import type { SchemaFieldType } from '@fc/dto2form';

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

  const schemaDefaults = {
    Jack: false,
    James: { a: 1, b: 3, c: 2 },
    Jane: 'hello world !',
    John: 123,
    Jolene: ['any', 'string', 'array'],
  };

  it('should return an empty object when schema is undefined', () => {
    // When
    const result = parseInitialValues(undefined);

    // Then
    expect(result).toStrictEqual({});
  });

  it('should return the schema initialValues when values are omitted', () => {
    // When
    const result = parseInitialValues(schemaMock);

    // Then
    expect(result).toStrictEqual(schemaDefaults);
  });

  it('should return the schema initialValues when values are null', () => {
    // When
    const result = parseInitialValues(schemaMock, null);

    // Then
    expect(result).toStrictEqual(schemaDefaults);
  });

  it('should return the schema initialValues when values are an empty object', () => {
    // When
    const result = parseInitialValues(schemaMock, {});

    // Then
    expect(result).toStrictEqual(schemaDefaults);
  });

  it('should merge provided values over schema initialValues', () => {
    // When
    const result = parseInitialValues(schemaMock, {
      Jack: true,
      James: { a: 3, c: { d: 'e', f: 'g' } },
      Jane: 'hello world updated !',
      John: undefined,
      Jolene: ['mock', 'values'],
    });

    // Then
    expect(result).toStrictEqual({
      Jack: true,
      James: { a: 3, c: { d: 'e', f: 'g' } },
      Jane: 'hello world updated !',
      John: undefined,
      Jolene: ['mock', 'values'],
    });
  });

  it('should keep schema initialValues for fields missing from provided values', () => {
    // When
    const result = parseInitialValues(schemaMock, {
      Jane: 'only Jane is overridden',
    });

    // Then
    expect(result).toStrictEqual({
      ...schemaDefaults,
      Jane: 'only Jane is overridden',
    });
  });

  it('should return an empty object when schema fields have no initialValue', () => {
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
    expect(result).toStrictEqual({});
  });
});
