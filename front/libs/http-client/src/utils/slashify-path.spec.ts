import { InvalidProtocol } from '../errors';
import { slashifyPath } from './slashify-path';

describe('slashifyPath', () => {
  it('should return the endpoint, when endpoint is an absolute url', () => {
    // when
    const result = slashifyPath('http://any-url.mock');

    // then
    expect(result).toEqual('http://any-url.mock');
  });

  it('should return a baseURL, when endpoint is empty', () => {
    // when
    const result = slashifyPath('', 'http://any-url.mock');

    // then
    expect(result).toEqual('http://any-url.mock/');
  });

  it('should return a joined url, when none have leading or trailing slashes', () => {
    // when
    const result = slashifyPath('any-endpoint', 'http://any-url.mock');

    // then
    expect(result).toEqual('http://any-url.mock/any-endpoint');
  });

  it('should return a joined url, when both have leading or trailing slashes', () => {
    // when
    const result = slashifyPath('/any-endpoint', 'http://any-url.mock/');

    // then
    expect(result).toEqual('http://any-url.mock/any-endpoint');
  });

  it('should return a joined url, when endpoint has a leading slash', () => {
    // when
    const result = slashifyPath('/any-endpoint', 'http://any-url.mock');

    // then
    expect(result).toEqual('http://any-url.mock/any-endpoint');
  });

  it('should return a joined url, when baseURL has a trailing slash', () => {
    // when
    const result = slashifyPath('any-endpoint', 'http://any-url.mock/');

    // then
    expect(result).toEqual('http://any-url.mock/any-endpoint');
  });

  it('should return a https url', () => {
    // when
    const result = slashifyPath('any-endpoint', 'https://any-url.mock/');

    // then
    expect(result).toEqual('https://any-url.mock/any-endpoint');
  });

  it('should return a ssh url', () => {
    // when
    const result = slashifyPath('any-endpoint', 'ssh://any-url.mock/');

    // then
    expect(result).toEqual('ssh://any-url.mock/any-endpoint');
  });

  it('should return a ftp url', () => {
    // when
    const result = slashifyPath('any-endpoint', 'ftp://any-url.mock/');

    // then
    expect(result).toEqual('ftp://any-url.mock/any-endpoint');
  });

  it('should throw an InvalidProtocol exception when baseURL has not a valid protocol', () => {
    expect(() => {
      slashifyPath('any-endpoint', '://any-url.mock/');
    }).toThrow(InvalidProtocol);
  });

  it('should return the endpoint and ignore baseURL, when endpoint is an absolute url', () => {
    // when
    const result = slashifyPath('http://any-endpoint-url.mock/any-endpoint', 'http://any-url.mock');

    // then
    expect(result).toEqual('http://any-endpoint-url.mock/any-endpoint');
  });

  it('should return the endpoint, when baseURL is empty', () => {
    // when
    const result = slashifyPath('http://any-url.mock');

    // then
    expect(result).toEqual('http://any-url.mock');
  });

  it('should return the endpoint, when baseURL is undefined', () => {
    // when
    const result = slashifyPath('http://any-url.mock', undefined);

    // then
    expect(result).toEqual('http://any-url.mock');
  });
});
