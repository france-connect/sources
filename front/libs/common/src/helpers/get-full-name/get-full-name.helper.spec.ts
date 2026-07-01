import { Strings } from '../../enums';
import { getFullName } from './get-full-name.helper';

describe('getFullName', () => {
  it('should return firstname and lastname when both are provided', () => {
    // When
    const result = getFullName('Jean', 'Dupont');

    // Then
    expect(result).toBe('Jean Dupont');
  });

  it('should return firstname only when lastname is empty', () => {
    // When
    const result = getFullName('Jean', '');

    // Then
    expect(result).toBe('Jean');
  });

  it('should return lastname only when firstname is empty', () => {
    // When
    const result = getFullName('', 'Dupont');

    // Then
    expect(result).toBe('Dupont');
  });

  it('should return firstname only when lastname is missing', () => {
    // When
    const result = getFullName('Jean');

    // Then
    expect(result).toBe('Jean');
  });

  it('should return an empty string when firstname is empty and lastname length === 0', () => {
    // When
    const result = getFullName('   ', '');

    // Then
    expect(result).toBe('   ');
  });

  it('should return an empty string when lastname is empty and firstname length === 0', () => {
    // When
    const result = getFullName('', '   ');

    // Then
    expect(result).toBe('   ');
  });

  it('should return an empty string when firstname and lastname are empty, an aditionnal space will be added', () => {
    // Given
    const firstnameMock = `  abc  `;
    const lastnameMock = `  def  `;

    // When
    const result = getFullName(firstnameMock, lastnameMock);

    // Then
    expect(result).toBe('  abc     def  ');

    const totalLength = firstnameMock.length + Strings.WHITE_SPACE.length + lastnameMock.length;

    expect(result?.length).toBe(totalLength);
  });

  it('should return undefined when lastname and firstname are empty', () => {
    // When
    const result = getFullName('', '');

    // Then
    expect(result).toBeUndefined();
  });

  it('should return undefined when lastname and firstname are undefined', () => {
    // When
    const result = getFullName();

    // Then
    expect(result).toBeUndefined();
  });
});
