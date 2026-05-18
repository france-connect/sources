import { formatFullName } from './format-full-name.util';

describe('formatFullName', () => {
  it('should return firstname and lastname when both are provided', () => {
    // Given
    const person = { firstname: 'Jean', lastname: 'Dupont' };

    // When
    const result = formatFullName(person);

    // Then
    expect(result).toBe('Jean Dupont');
  });

  it('should return firstname only when lastname is missing', () => {
    // Given
    const person = { firstname: 'Jean' };

    // When
    const result = formatFullName(person);

    // Then
    expect(result).toBe('Jean');
  });

  it('should return lastname only when firstname is missing', () => {
    // Given
    const person = { lastname: 'Dupont' };

    // When
    const result = formatFullName(person);

    // Then
    expect(result).toBe('Dupont');
  });

  it('should return "-" when firstname and lastname are empty', () => {
    // Given
    const person = { firstname: '', lastname: '' };

    // When
    const result = formatFullName(person);

    // Then
    expect(result).toBe('-');
  });

  it('should return "-" when person is undefined', () => {
    // When
    const result = formatFullName();

    // Then
    expect(result).toBe('-');
  });
});
