import { parseBoolean } from './parse-boolean';

describe('parseBoolean transform', () => {
  it('should return true with input "true"', () => {
    // Given
    const input = 'true';
    // When
    const result = parseBoolean(input);
    // Then
    expect(result).toBe(true);
  });
  it('should return true with input "on"', () => {
    // Given
    const input = 'on';
    // When
    const result = parseBoolean(input);
    // Then
    expect(result).toBe(true);
  });
  it('should return true with input "1"', () => {
    // Given
    const input = '1';
    // When
    const result = parseBoolean(input);
    // Then
    expect(result).toBe(true);
  });
  it('should return false with input "false"', () => {
    // Given
    const input = 'false';
    // When
    const result = parseBoolean(input);
    // Then
    expect(result).toBe(false);
  });
  it('should return false with input "off"', () => {
    // Given
    const input = 'off';
    // When
    const result = parseBoolean(input);
    // Then
    expect(result).toBe(false);
  });
  it('should return false with input "0"', () => {
    // Given
    const input = '0';
    // When
    const result = parseBoolean(input);
    // Then
    expect(result).toBe(false);
  });
  it('should return undefined with input undefined', () => {
    // Given
    const input = undefined;
    // When
    const result = parseBoolean(input);
    // Then
    expect(result).toBeUndefined;
  });
  it('should return undefined with other strings 1/2', () => {
    // Given
    const input = 'undefined';
    // When
    const result = parseBoolean(input);
    // Then
    expect(result).toBeUndefined;
  });
  it('should return undefined with other strings 2/2', () => {
    // Given
    const input = 'random';
    // When
    const result = parseBoolean(input);
    // Then
    expect(result).toBeUndefined;
  });
  it('should return undefined with empty string', () => {
    // Given
    const input = '';
    // When
    const result = parseBoolean(input);
    // Then
    expect(result).toBeUndefined;
  });
  it('should return undefined with truthy expression', () => {
    // Given
    const input = '2';
    // When
    const result = parseBoolean(input);
    // Then
    expect(result).toBeUndefined;
  });
  it('should return true with actual true value', () => {
    // Given
    const input = true;
    // When
    const result = parseBoolean(input);
    // Then
    expect(result).toBe(true);
  });
  it('should return false with actual false value', () => {
    // Given
    const input = false;
    // When
    const result = parseBoolean(input);
    // Then
    expect(result).toBe(false);
  });
  it('should return true with 1 (as number) value', () => {
    // Given
    const input = 1;
    // When
    const result = parseBoolean(input);
    // Then
    expect(result).toBe(true);
  });
  it('should return false with 0 (as number) value', () => {
    // Given
    const input = 0;
    // When
    const result = parseBoolean(input);
    // Then
    expect(result).toBe(false);
  });
});
