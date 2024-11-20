import { addLeadingZeros, generateErrorId, getCode } from './code.helper';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));

describe('getCode', () => {
  it('should return a string', () => {
    // Given
    const scope = 1;
    const code = 2;

    // When
    const result = getCode(scope, code);

    // Then
    expect(typeof result).toBe('string');
  });
  it('should return the correct value for 1 digit code and 1 digit scope', () => {
    // Given
    const scope = 1;
    const code = 2;

    // When
    const result = getCode(scope, code);

    // Then
    expect(result).toBe('010002');
  });
  it('should return the correct value for 2 digits code and 2 digits scope', () => {
    // Given
    const scope = 23;
    const code = 12;

    // When
    const result = getCode(scope, code);

    // Then
    expect(result).toBe('230012');
  });
  it('should return the correct value for 3 digits code and 1 digits scope', () => {
    // Given
    const scope = 3;
    const code = 421;

    // When
    const result = getCode(scope, code);

    // Then
    expect(result).toBe('030421');
  });
});

describe('addLeadingZeros', () => {
  it('should return a string', () => {
    // Given
    const value = 1;
    const length = 4;

    // When
    const result = addLeadingZeros(value, length);

    // Then
    expect(typeof result).toBe('string');
  });

  it('should return the correct length', () => {
    // Given
    const value = 1;
    const length = 4;

    // When
    const result = addLeadingZeros(value, length);

    // Then
    expect(result).toHaveLength(length);
  });

  it('should return the correct value', () => {
    // Given
    const value = 1;
    const length = 4;

    // When
    const result = addLeadingZeros(value, length);

    // Then
    expect(result).toBe('0001');
  });

  it('should return the input as is if it is a string', () => {
    // Given
    const value = 'a string';
    const length = 4;

    // When
    const result = addLeadingZeros(value, length);

    // Then
    expect(result).toBe('a string');
  });
});

describe('generateErrorId', () => {
  it('should return a string', () => {
    // When
    const result = generateErrorId();

    // Then
    expect(result).toBe('mocked-uuid');
  });
});
