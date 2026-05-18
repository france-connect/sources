import {
  camelToPascalCase,
  objectPropertiesCamelToPascal,
  objectPropertiesPascalToCamel,
  pascalToCamelCase,
} from './case-conversion.helper';

describe('pascalToCamelCase', () => {
  it('should lowercase the first character', () => {
    // When
    const result = pascalToCamelCase('MyField');

    // Then
    expect(result).toBe('myField');
  });

  it('should not alter the rest of the string', () => {
    // When
    const result = pascalToCamelCase('MyFieldName');

    // Then
    expect(result).toBe('myFieldName');
  });
});

describe('camelToPascalCase', () => {
  it('should uppercase the first character', () => {
    // When
    const result = camelToPascalCase('myField');

    // Then
    expect(result).toBe('MyField');
  });

  it('should not alter the rest of the string', () => {
    // When
    const result = camelToPascalCase('myFieldName');

    // Then
    expect(result).toBe('MyFieldName');
  });
});

describe('objectPropertiesPascalToCamel', () => {
  it('should convert all PascalCase keys to camelCase', () => {
    // Given
    const objectMock = { Name: 'Alice', Value: '42' };

    // When
    const result = objectPropertiesPascalToCamel(objectMock);

    // Then
    expect(result).toEqual({ name: 'Alice', value: '42' });
  });
});

describe('objectPropertiesCamelToPascal', () => {
  it('should convert all camelCase keys to PascalCase', () => {
    // Given
    const objectMock = { name: 'Alice', value: '42' };

    // When
    const result = objectPropertiesCamelToPascal(objectMock);

    // Then
    expect(result).toEqual({ Name: 'Alice', Value: '42' });
  });
});
