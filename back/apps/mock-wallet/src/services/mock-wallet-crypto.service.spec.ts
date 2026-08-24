import { decodeJwt, decodeProtectedHeader, jwtVerify } from 'jose';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { JwtService } from '@fc/jwt';

import { getConfigMock } from '@mocks/config';

import {
  MockWalletInvalidRequestObjectHeaderException,
  MockWalletInvalidSignatureException,
  MockWalletJarmEncryptionException,
  MockWalletMissingTrustedJwksException,
} from '../exceptions';
import { RequestObjectPayload, WalletResponsePayload } from '../interfaces';
import { MockWalletCryptoService } from './mock-wallet-crypto.service';

jest.mock('jose', () => ({
  decodeProtectedHeader: jest.fn(),
  decodeJwt: jest.fn(),
  jwtVerify: jest.fn(),
  createLocalJWKSet: jest.fn(),
}));

describe('MockWalletCryptoService', () => {
  let service: MockWalletCryptoService;

  const configMock = getConfigMock();
  const jwtMock = {
    encrypt: jest.fn(),
    getFirstRelevantKey: jest.fn(),
  };

  const decodeProtectedHeaderMock = jest.mocked(decodeProtectedHeader);
  const decodeJwtMock = jest.mocked(decodeJwt);
  const jwtVerifyMock = jest.mocked(jwtVerify);

  const trustedJwks = { keys: [{ kid: 'k1', use: 'sig', alg: 'ES256' }] };

  const responsePayload: WalletResponsePayload = {
    state: 'state-mock',
    vp_token: 'vp-token-mock',
    presentation_submission: {
      id: 'id',
      definition_id: 'def',
      descriptor_map: [],
    },
  };

  const encKey = { kid: 'enc1', use: 'enc', alg: 'ECDH-ES' };
  const request = {
    client_metadata: {
      authorization_encrypted_response_alg: 'ECDH-ES',
      authorization_encrypted_response_enc: 'A256GCM',
      jwks: { keys: [encKey] },
    },
  } as unknown as RequestObjectPayload;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [MockWalletCryptoService, JwtService, ConfigService],
    })
      .overrideProvider(JwtService)
      .useValue(jwtMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .compile();

    service = module.get<MockWalletCryptoService>(MockWalletCryptoService);

    configMock.get.mockReturnValue({ trustedJwks });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('decodeProtectedHeader', () => {
    it('should delegate to jose', () => {
      // Given
      decodeProtectedHeaderMock.mockReturnValue({ alg: 'ES256' });

      // When
      const result = service.decodeProtectedHeader('jwt');

      // Then
      expect(result).toEqual({ alg: 'ES256' });
    });

    it('should throw when the protected header cannot be decoded', () => {
      // Given
      decodeProtectedHeaderMock.mockImplementation(() => {
        throw new Error('invalid header');
      });

      // When / Then
      expect(() => service.decodeProtectedHeader('jwt')).toThrow(
        MockWalletInvalidRequestObjectHeaderException,
      );
    });
  });

  describe('decodePayload', () => {
    it('should delegate to jose', () => {
      // Given
      decodeJwtMock.mockReturnValue({ client_id: 'x' });

      // When
      const result = service.decodePayload('jwt');

      // Then
      expect(result).toEqual({ client_id: 'x' });
    });
  });

  describe('verifySignature', () => {
    it('should throw when no trusted JWKS is configured', async () => {
      // Given
      configMock.get.mockReturnValue({ trustedJwks: undefined });

      // When / Then
      await expect(service.verifySignature('jwt')).rejects.toThrow(
        MockWalletMissingTrustedJwksException,
      );
    });

    it('should resolve when the signature is valid', async () => {
      // Given
      jwtVerifyMock.mockResolvedValue({} as never);

      // When / Then
      await expect(service.verifySignature('jwt')).resolves.toBeUndefined();
    });

    it('should throw when the signature is invalid', async () => {
      // Given
      jwtVerifyMock.mockRejectedValue(new Error('bad'));

      // When / Then
      await expect(service.verifySignature('jwt')).rejects.toThrow(
        MockWalletInvalidSignatureException,
      );
    });
  });

  describe('encryptJarm', () => {
    it('should encrypt the response payload with the verifier enc key', async () => {
      // Given
      jwtMock.getFirstRelevantKey.mockReturnValue(encKey);
      jwtMock.encrypt.mockResolvedValue('jwe-mock');

      // When
      const result = await service.encryptJarm(responsePayload, request);

      // Then
      expect(result).toBe('jwe-mock');
      expect(jwtMock.encrypt).toHaveBeenCalledExactlyOnceWith(
        expect.any(String),
        encKey,
        'A256GCM',
      );
    });

    it('should throw when no encryption key is available', async () => {
      // Given
      jwtMock.getFirstRelevantKey.mockImplementation(() => {
        throw new Error('no relevant key');
      });
      const noKeyRequest = {
        client_metadata: {
          authorization_encrypted_response_alg: 'ECDH-ES',
          authorization_encrypted_response_enc: 'A256GCM',
          jwks: { keys: [] },
        },
      } as unknown as RequestObjectPayload;

      // When / Then
      await expect(
        service.encryptJarm(responsePayload, noKeyRequest),
      ).rejects.toThrow(MockWalletJarmEncryptionException);
    });

    it('should throw when the request carries no client metadata', async () => {
      // Given
      jwtMock.getFirstRelevantKey.mockImplementation(() => {
        throw new Error('no relevant key');
      });
      const emptyRequest = {} as unknown as RequestObjectPayload;

      // When / Then
      await expect(
        service.encryptJarm(responsePayload, emptyRequest),
      ).rejects.toThrow(MockWalletJarmEncryptionException);
    });

    it('should throw when the encryption fails', async () => {
      // Given
      jwtMock.encrypt.mockRejectedValue(new Error('boom'));

      // When / Then
      await expect(
        service.encryptJarm(responsePayload, request),
      ).rejects.toThrow(MockWalletJarmEncryptionException);
    });
  });
});
