import { errors } from 'oidc-provider';

import { OidcProviderRuntimeException } from './oidc-provider-runtime-exception';

describe('OidcProviderRuntimeException', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getCodeFromError', () => {
    it('should call return code for given error class', () => {
      // Given
      const error = new errors.SessionNotFound('foo');
      const exception = new OidcProviderRuntimeException(error);
      // When
      const result = exception.getCodeFromError(error);
      // Then
      expect(result).toBe(110);
    });

    it('should call return code for another given error class', () => {
      // Given
      const error = new errors.InvalidClient('foo');
      const exception = new OidcProviderRuntimeException(error);
      // When
      const result = exception.getCodeFromError(error);
      // Then
      expect(result).toBe(106);
    });

    it('should call return code for yet antoher given error class', () => {
      // Given
      const error = new errors.UnsupportedGrantType('foo');
      const exception = new OidcProviderRuntimeException(error);
      // When
      const result = exception.getCodeFromError(error);
      // Then
      expect(result).toBe(126);
    });

    it('shoud return default code if error is not instance of any known error', () => {
      // Given
      const error = new TypeError('foo');
      const exception = new OidcProviderRuntimeException(error);
      // When
      const result = exception.getCodeFromError(
        error as errors.OIDCProviderError,
      );
      // Then
      expect(result).toBe(100);
    });

    it('shoud return default code if the error is not instance of any known error and an unknown code is provided', () => {
      // Given
      const error = new TypeError('foo');
      const exception = new OidcProviderRuntimeException(error, 666);
      // When
      const result = exception.getCodeFromError(
        error as errors.OIDCProviderError,
      );
      // Then
      expect(result).toBe(100);
    });
  });
});
