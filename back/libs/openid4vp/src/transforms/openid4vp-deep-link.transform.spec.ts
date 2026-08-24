import { TransformFnParams } from 'class-transformer';

import { Openid4vpResponseType } from '../enums';
import { Openid4vpDeepLinkInterface } from '../interfaces';
import { openId4vpDeepLink } from './openid4vp-deep-link.transform';

describe('Openid4vp deep link transform', () => {
  describe('openId4vpDeepLink', () => {
    const validUrl =
      'openid4vp://?client_id=https%3A%2F%2Fexample.com&request_uri=https%3A%2F%2Fexample.com%2Frequest&response_type=vp_token';

    const urlWithoutClientId =
      'openid4vp://?request_uri=https%3A%2F%2Fexample.com%2Frequest&response_type=vp_token';

    const urlWithoutRequestUri =
      'openid4vp://?client_id=https%3A%2F%2Fexample.com&response_type=vp_token';

    const urlWithoutResponseType =
      'openid4vp://?client_id=https%3A%2F%2Fexample.com&request_uri=https%3A%2F%2Fexample.com%2Frequest';

    const httpsUrl =
      'https://example.com?client_id=foo&request_uri=bar&response_type=vp_token';

    it('should return the protocol from a valid deep link URL', () => {
      // Given
      const options = { value: validUrl } as TransformFnParams;

      // When
      const result = openId4vpDeepLink(options) as Openid4vpDeepLinkInterface;

      // Then
      expect(result.protocol).toBe('openid4vp:');
    });

    it('should return the clientId from a valid deep link URL', () => {
      // Given
      const options = { value: validUrl } as TransformFnParams;

      // When
      const result = openId4vpDeepLink(options) as Openid4vpDeepLinkInterface;

      // Then
      expect(result.clientId).toBe('https://example.com');
    });

    it('should return the requestUri from a valid deep link URL', () => {
      // Given
      const options = { value: validUrl } as TransformFnParams;

      // When
      const result = openId4vpDeepLink(options) as Openid4vpDeepLinkInterface;

      // Then
      expect(result.requestUri).toBe('https://example.com/request');
    });

    it('should return the responseType from a valid deep link URL', () => {
      // Given
      const options = { value: validUrl } as TransformFnParams;

      // When
      const result = openId4vpDeepLink(options) as Openid4vpDeepLinkInterface;

      // Then
      expect(result.responseType).toBe(Openid4vpResponseType.VP_TOKEN);
    });

    it('should return a toString method that returns the original value', () => {
      // Given
      const options = { value: validUrl } as TransformFnParams;

      // When
      const result = openId4vpDeepLink(options) as Openid4vpDeepLinkInterface;

      // Then
      expect(result.toString()).toBe(validUrl);
    });

    it('should return false from an empty string', () => {
      // Given
      const options = { value: '' } as TransformFnParams;

      // When
      const result = openId4vpDeepLink(options);

      // Then
      expect(result).toBeUndefined();
    });

    it('should return false from a plain string', () => {
      // Given
      const options = { value: 'not-a-url' } as TransformFnParams;

      // When
      const result = openId4vpDeepLink(options);

      // Then
      expect(result).toBeUndefined();
    });

    it('should return false from null', () => {
      // Given
      const options = { value: null } as unknown as TransformFnParams;

      // When
      const result = openId4vpDeepLink(options);

      // Then
      expect(result).toBeUndefined();
    });

    it('should return false from undefined', () => {
      // Given
      const options = { value: undefined } as TransformFnParams;

      // When
      const result = openId4vpDeepLink(options);

      // Then
      expect(result).toBeUndefined();
    });

    it('should return false from a number', () => {
      // Given
      const options = { value: 42 } as unknown as TransformFnParams;

      // When
      const result = openId4vpDeepLink(options);

      // Then
      expect(result).toBeUndefined();
    });

    it('should return null for clientId when client_id param is absent', () => {
      // Given
      const options = { value: urlWithoutClientId } as TransformFnParams;

      // When
      const result = openId4vpDeepLink(options) as Openid4vpDeepLinkInterface;

      // Then
      expect(result.clientId).toBeNull();
    });

    it('should return null for requestUri when request_uri param is absent', () => {
      // Given
      const options = { value: urlWithoutRequestUri } as TransformFnParams;

      // When
      const result = openId4vpDeepLink(options) as Openid4vpDeepLinkInterface;

      // Then
      expect(result.requestUri).toBeNull();
    });

    it('should return null for responseType when response_type param is absent', () => {
      // Given
      const options = { value: urlWithoutResponseType } as TransformFnParams;

      // When
      const result = openId4vpDeepLink(options) as Openid4vpDeepLinkInterface;

      // Then
      expect(result.responseType).toBeNull();
    });

    it('should return the protocol as-is from a non-openid4vp URL', () => {
      // Given
      const options = { value: httpsUrl } as TransformFnParams;

      // When
      const result = openId4vpDeepLink(options) as Openid4vpDeepLinkInterface;

      // Then
      expect(result.protocol).toBe('https:');
    });
  });
});
