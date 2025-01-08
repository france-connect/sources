import { isValidProtocol } from './is-valid-protocol';

describe('isValidProtocol', () => {
  it('should return true, when starts with http', () => {
    // When
    const result = isValidProtocol('http://any-url-mock.com');

    // Then
    expect(result).toBeTrue();
  });

  it('should return true, when starts with https', () => {
    // When
    const result = isValidProtocol('https://any-url-mock.com');

    // Then
    expect(result).toBeTrue();
  });

  it('should return true, when starts with ssh', () => {
    // When
    const result = isValidProtocol('ssh://any-url-mock.com');

    // Then
    expect(result).toBeTrue();
  });

  it('should return true, when starts with ftp', () => {
    // When
    const result = isValidProtocol('ftp://any-url-mock.com');

    // Then
    expect(result).toBeTrue();
  });

  it('should return false, when url starts with git://', () => {
    // When
    const result = isValidProtocol('git://any-url-mock.com');

    // Then
    expect(result).toBeFalse();
  });

  it('should return false, when url starts with file://', () => {
    // When
    const result = isValidProtocol('git://any-url-mock.com');

    // Then
    expect(result).toBeFalse();
  });

  it('should return false, when url starts with ://', () => {
    // When
    const result = isValidProtocol('://any-url-mock.com');

    // Then
    expect(result).toBeFalse();
  });

  it('should return false, when url starts with //', () => {
    // When
    const result = isValidProtocol('//any-url-mock.com');

    // Then
    expect(result).toBeFalse();
  });

  it('should return false, when url is an empty string', () => {
    // When
    const result = isValidProtocol('');

    // Then
    expect(result).toBeFalse();
  });
});
