import { ExecutionContext } from '@nestjs/common';

import {
  InvalidHttpAuthTokenException,
  MissingHttpAuthTokenException,
} from '../exceptions';
import {
  extractHttpAuthToken,
  HttpAuthTokenDecorator,
} from './http-auth-token.decorator';

describe('HttpAuthTokenDecorator', () => {
  describe('extractHttpAuthToken', () => {
    it('should return undefined if bearer does not contain "Bearer " prefix', () => {
      // Given
      const inputMock = 'Some random string';
      // When
      const result = extractHttpAuthToken(inputMock);
      // Then
      expect(result).toBe(undefined);
    });

    it('should return undefined if bearer does not contain a token', () => {
      // Given
      const inputMock = 'Bearer ';
      // When
      const result = extractHttpAuthToken(inputMock);
      // Then
      expect(result).toBe(undefined);
    });

    it('should return undefined if bearer contains a too long string', () => {
      // Given
      const inputMock =
        'Bearer Loremipsumdolorsitametconsecteturadipiscingelitseddoeiusmodtempos';
      // When
      const result = extractHttpAuthToken(inputMock);
      // Then
      expect(result).toBe(undefined);
    });

    it('should return undefined is bearer contains space characters', () => {
      // Given
      const inputMock = 'Bearer some space separated Random bearer';
      // When
      const result = extractHttpAuthToken(inputMock);
      // Then
      expect(result).toBe(undefined);
    });

    it('should return undefined is bearer contains strange characters', () => {
      // Given
      const inputMock = 'SomeStrange😉🍌input';
      // When
      const result = extractHttpAuthToken(inputMock);
      // Then
      expect(result).toBe(undefined);
    });

    it('should return true is bearer is properly formed', () => {
      // Given
      const inputMock = 'Bearer some-Random_bearer+string';
      // When
      const result = extractHttpAuthToken(inputMock);
      // Then
      expect(result).toBe('some-Random_bearer+string');
    });
  });
  describe('HttpAuthToken', () => {
    // Given
    const dataMock = {};
    const getRequestMock = jest.fn();
    const ctxMock = {
      switchToHttp: () => ({
        getRequest: getRequestMock,
      }),
    } as unknown as ExecutionContext;

    it('should throw if validate returns undefined', () => {
      // Given
      getRequestMock.mockReturnValueOnce({
        headers: {},
      });
      // Then
      expect(() => HttpAuthTokenDecorator(dataMock, ctxMock)).toThrow(
        MissingHttpAuthTokenException,
      );
    });

    it('should throw if validate returns undefined', () => {
      // Given
      getRequestMock.mockReturnValueOnce({
        headers: {
          authorization: 'invalid header value',
        },
      });
      // Then
      expect(() => HttpAuthTokenDecorator(dataMock, ctxMock)).toThrow(
        InvalidHttpAuthTokenException,
      );
    });

    it('should return the validated token', () => {
      // Given
      getRequestMock.mockReturnValueOnce({
        headers: {
          authorization: 'Bearer valid-header-value',
        },
      });
      // When
      const result = HttpAuthTokenDecorator(dataMock, ctxMock);
      // Then
      expect(result).toBe('valid-header-value');
    });
  });
});
