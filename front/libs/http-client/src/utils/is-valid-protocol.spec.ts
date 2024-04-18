import { isValidProtocol } from './is-valid-protocol';

describe('isValidProtocol', () => {
  it('should return true, when starts with http', () => {
    // when
    const result = isValidProtocol('http://any-url-mock.com');

    // then
    expect(result).toBeTrue();
  });

  it('should return true, when starts with https', () => {
    // when
    const result = isValidProtocol('https://any-url-mock.com');

    // then
    expect(result).toBeTrue();
  });

  it('should return true, when starts with ssh', () => {
    // when
    const result = isValidProtocol('ssh://any-url-mock.com');

    // then
    expect(result).toBeTrue();
  });

  it('should return true, when starts with ftp', () => {
    // when
    const result = isValidProtocol('ftp://any-url-mock.com');

    // then
    expect(result).toBeTrue();
  });

  it('should return false, when url starts with git://', () => {
    // when
    const result = isValidProtocol('git://any-url-mock.com');

    // then
    expect(result).toBeFalse();
  });

  it('should return false, when url starts with file://', () => {
    // when
    const result = isValidProtocol('git://any-url-mock.com');

    // then
    expect(result).toBeFalse();
  });

  it('should return false, when url starts with ://', () => {
    // when
    const result = isValidProtocol('://any-url-mock.com');

    // then
    expect(result).toBeFalse();
  });

  it('should return false, when url starts with //', () => {
    // when
    const result = isValidProtocol('//any-url-mock.com');

    // then
    expect(result).toBeFalse();
  });

  it('should return false, when url is an empty string', () => {
    // when
    const result = isValidProtocol('');

    // then
    expect(result).toBeFalse();
  });
});
