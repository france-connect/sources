import { RedirectException } from '../../exceptions';
import { redirectToUrl } from './redirect-to-url.util';

describe('redirectToUrl', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { assign: jest.fn(), origin: 'http://mock-origin.com' },
      writable: true,
    });
  });

  it('should throw an RedirectException if the url is empty', () => {
    // When/Then
    expect(() => redirectToUrl('')).toThrow(RedirectException);
  });

  it('should throw an RedirectException if the url is undefined', () => {
    // When/Then
    expect(() => redirectToUrl(undefined as unknown as string)).toThrow(RedirectException);
  });

  it('should throw an RedirectException if the url is an empty string', () => {
    // When/Then
    expect(() => redirectToUrl('                ')).toThrow(RedirectException);
  });

  it('should call window.location.href with the given url', () => {
    // Given
    const url = 'http://mock-url.com';

    // When
    redirectToUrl(url);

    // Then
    expect(window.location.href).toBe('http://mock-url.com/');
  });

  it('should call window.location.href with an encoded url', () => {
    // Given
    const url =
      'http://mock-url.com/ with spaces / and /slashes /?query=string&param= super mega cool';

    // When
    redirectToUrl(url);

    // Then
    expect(window.location.href).toBe(
      'http://mock-url.com/%20with%20spaces%20/%20and%20/slashes%20/?query=string&param=%20super%20mega%20cool',
    );
  });

  it('should handle relative URLs correctly', () => {
    // Given
    const url = '/relative/path';

    // When
    redirectToUrl(url);

    // Then
    expect(window.location.href).toBe('http://mock-origin.com/relative/path');
  });
});
