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

  it('should return false for an array with invalid URLs', () => {
    // Given
    const urlList = ['https://example.com', 'invalid-url'];

    // When
    const result = hasSameHost(urlList);

    // Then
    expect(result).toBe(false);
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
});
