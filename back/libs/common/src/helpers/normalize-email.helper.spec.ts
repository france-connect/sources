import { normalizeEmail } from './normalize-email.helper';

describe('normalizeEmail', () => {
  it('should convert uppercase to lowercase', () => {
    // When
    const result = normalizeEmail('TEST@EXAMPLE.COM');

    // Then
    expect(result).toBe('test@example.com');
  });

  it('should convert mixed case to lowercase', () => {
    // When
    const result = normalizeEmail('Test@Example.Com');

    // Then
    expect(result).toBe('test@example.com');
  });

  it('should leave an already normalized email unchanged', () => {
    // When
    const result = normalizeEmail('test@example.com');

    // Then
    expect(result).toBe('test@example.com');
  });
});
