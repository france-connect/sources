import { InvalidProtocol } from '../errors';
import { slashifyPath } from './slashify-path';

describe('slashifyPath', () => {
  it('should return the endpoint, when endpoint is an absolute url', () => {
    // When
    const result = slashifyPath('http://any-url.mock');

    // Then
    expect(result).toBe('http://any-url.mock');
  });

  it('should return a baseURL, when endpoint is empty', () => {
    // When
    const result = slashifyPath('', 'http://any-url.mock');

    // Then
    expect(result).toBe('http://any-url.mock/');
  });

  it('should return a joined url, when none have leading or trailing slashes', () => {
    // When
    const result = slashifyPath('any-endpoint', 'http://any-url.mock');

    // Then
    expect(result).toBe('http://any-url.mock/any-endpoint');
  });

  it('should return a joined url, when both have leading or trailing slashes', () => {
    // When
    const result = slashifyPath('/any-endpoint', 'http://any-url.mock/');

    // Then
    expect(result).toBe('http://any-url.mock/any-endpoint');
  });

  it('should return a joined url, when endpoint has a leading slash', () => {
    // When
    const result = slashifyPath('/any-endpoint', 'http://any-url.mock');

    // Then
    expect(result).toBe('http://any-url.mock/any-endpoint');
  });

  it('should return a joined url, when baseURL has a trailing slash', () => {
    // When
    const result = slashifyPath('any-endpoint', 'http://any-url.mock/');

    // Then
    expect(result).toBe('http://any-url.mock/any-endpoint');
  });

  it('should return a https url', () => {
    // When
    const result = slashifyPath('any-endpoint', 'https://any-url.mock/');

    // Then
    expect(result).toBe('https://any-url.mock/any-endpoint');
  });

  it('should return a ssh url', () => {
    // When
    const result = slashifyPath('any-endpoint', 'ssh://any-url.mock/');

    // Then
    expect(result).toBe('ssh://any-url.mock/any-endpoint');
  });

  it('should return a ftp url', () => {
    // When
    const result = slashifyPath('any-endpoint', 'ftp://any-url.mock/');

    // Then
    expect(result).toBe('ftp://any-url.mock/any-endpoint');
  });

  it('should throw an InvalidProtocol exception when baseURL has not a valid protocol', () => {
    expect(() => {
      slashifyPath('any-endpoint', '://any-url.mock/');
    }).toThrow(InvalidProtocol);
  });

  it('should return the endpoint and ignore baseURL, when endpoint is an absolute url', () => {
    // When
    const result = slashifyPath('http://any-endpoint-url.mock/any-endpoint', 'http://any-url.mock');

    // Then
    expect(result).toBe('http://any-endpoint-url.mock/any-endpoint');
  });

  it('should return the endpoint, when baseURL is empty', () => {
    // When
    const result = slashifyPath('http://any-url.mock');

    // Then
    expect(result).toBe('http://any-url.mock');
  });

  it('should return the endpoint, when baseURL is undefined', () => {
    // When
    const result = slashifyPath('http://any-url.mock', undefined);

    // Then
    expect(result).toBe('http://any-url.mock');
  });
});
