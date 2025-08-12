import { hasSameHost } from './url.helper';

describe('hasSameHost', () => {
  it('should return true for an empty array', () => {
    // Given
    const urlList = [];

    // When
    const result = hasSameHost(urlList);

    // Then
    expect(result).toBe(true);
  });

  it('should return true for an array with consistent domains', () => {
    // Given
    const urlList = [
      'https://example.com/path1',
      'https://example.com/path2',
      'https://example.com/path3',
    ];

    // When
    const result = hasSameHost(urlList);

    // Then
    expect(result).toBe(true);
  });

  it('should return false for an array with inconsistent domains', () => {
    // Given
    const urlList = [
      'https://example.com/path1',
      'https://another-example.com/path2',
      'https://example.com/path3',
    ];

    // When
    const result = hasSameHost(urlList);

    // Then
    expect(result).toBe(false);
  });

  it('should consider host different when port are different', () => {
    // Given
    const urlList = [
      'https://example.com:8080/path1',
      'https://example.com:9090/path2',
      'https://example.com:8080/path3',
    ];

    // When
    const result = hasSameHost(urlList);

    // Then
    expect(result).toBe(false);
  });

  it('should return false when host are mixed with localhost with a port', () => {
    // Given
    const urlList = [
      'https://example.com/path1',
      'http://localhost:8080/path2',
    ];

    // When
    const result = hasSameHost(urlList);

    // Then
    expect(result).toBe(false);
  });

  it('should return false when host are mixed with localhost', () => {
    // Given
    const urlList = ['https://example.com/path1', 'http://localhost/path2'];

    // When
    const result = hasSameHost(urlList);

    // Then
    expect(result).toBe(false);
  });

  it('should return false when hosts are localhost with different ports', () => {
    // Given
    const urlList = ['http://localhost:4200', 'http://localhost:8000'];

    // When
    const result = hasSameHost(urlList);

    // Then
    expect(result).toBe(false);
  });
});
