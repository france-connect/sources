import { createPublicKey, JsonWebKey, KeyObject } from 'crypto';

import { JWK } from 'jose';

import { OidcProviderSignAdapter } from './oidc-provider-sign.adapter';

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  createPublicKey: jest.fn(),
}));

describe('OidcProviderSignAdapter', () => {
  const kid = 'test-kid';
  const alg = 'ES256';

  const keyObjectMock = Symbol('keyObjectMock') as unknown as KeyObject;

  const signFnMock = jest.fn();

  const sigMock = Symbol('sigMock');

  beforeEach(() => {
    jest.resetAllMocks();
    signFnMock.mockResolvedValue(sigMock);
  });

  describe('constructor & getters', () => {
    it('should expose alg, kid, and keyObject', () => {
      // When
      const key = new OidcProviderSignAdapter(
        kid,
        alg,
        keyObjectMock,
        signFnMock,
      );

      // Then
      expect(key.alg).toBe(alg);
      expect(key.kid).toBe(kid);
      expect(key.use).toBe('sig');
      expect(key.keyObject()).toBe(keyObjectMock);
    });
  });

  describe('sign', () => {
    it('should call the provided sign function with data and alg', async () => {
      // Given
      const key = new OidcProviderSignAdapter(
        kid,
        alg,
        keyObjectMock,
        signFnMock,
      );
      const data = new Uint8Array([1, 2, 3]);

      // When
      const result = await key.sign(data);

      expect(signFnMock).toHaveBeenCalledExactlyOnceWith(data, alg);
      expect(result).toEqual(sigMock);
    });
  });

  describe('fromJwk', () => {
    // Given
    const mockJwk: JWK = {
      kty: 'EC',
      crv: 'P-256',
      x: 'f83OJ3D2xF4r5bN2S3s8kTtUOqO9YzFQd2V8wUQ3Q2M',
      y: 'x_FEzRu9p5L7ppGFPQvT9tYJqV8O5F8jE5jZ1sGx8ZQ',
      kid,
      alg,
      use: 'sig',
    };
    const createPublicKeyMock = jest.mocked(createPublicKey);

    beforeEach(() => {
      createPublicKeyMock.mockReturnValue(keyObjectMock);
    });

    it('should create public key', () => {
      // When
      OidcProviderSignAdapter.fromJwk(mockJwk, signFnMock);

      // Then
      expect(createPublicKeyMock).toHaveBeenCalledExactlyOnceWith({
        key: mockJwk as JsonWebKey,
        format: 'jwk',
      });
    });

    it('should return a configured OidcProviderHsmAdapter', () => {
      // When
      const key = OidcProviderSignAdapter.fromJwk(mockJwk, signFnMock);

      // Then
      expect(key).toBeInstanceOf(OidcProviderSignAdapter);
      expect(key.kid).toBe(kid);
      expect(key.alg).toBe(alg);
      expect(key.keyObject()).toBe(keyObjectMock);
    });
  });
});
