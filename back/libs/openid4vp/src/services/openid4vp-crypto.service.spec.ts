import type { Jwk, JwtSigner } from '@openid4vc/oauth2';
import { importJWK, JWK, KeyLike, SignJWT } from 'jose';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { JwkHelper, JwtService } from '@fc/jwt';

import { getConfigMock } from '@mocks/config';
import { getJwtServiceMock } from '@mocks/jwt';

import { JwtSignerInterface } from '../interfaces';
import { Openid4vpCryptoService } from './openid4vp-crypto.service';

jest.mock('jose');

jest.mock('@fc/jwt', () => ({
  ...jest.requireActual('@fc/jwt'),
  JwkHelper: {
    publicFromPrivate: jest.fn(),
  },
}));

describe('Openid4vpCryptoService', () => {
  let service: Openid4vpCryptoService;

  const configMock = getConfigMock();
  const jwtServiceMock = getJwtServiceMock();

  const importJWKMock = jest.mocked(importJWK);
  const SignJWTMock = jest.mocked(SignJWT);
  const publicFromPrivateMock = jest.mocked(JwkHelper.publicFromPrivate);

  const signKeyMock = { kid: 'sigKid', alg: 'ES256', use: 'sig' } as JWK;
  const encKeyMock = {
    kid: 'encKid',
    alg: 'ECDH-ES+A256KW',
    use: 'enc',
  } as JWK;
  const jwksMock = { keys: [signKeyMock, encKeyMock] };
  const openid4vpConfigMock = { jwks: jwksMock };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [Openid4vpCryptoService, ConfigService, JwtService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(JwtService)
      .useValue(jwtServiceMock)
      .compile();

    service = module.get<Openid4vpCryptoService>(Openid4vpCryptoService);
    configMock.get.mockReturnValue(openid4vpConfigMock);

    jwtServiceMock.getFirstRelevantKey.mockReturnValue(signKeyMock);

    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getJwtSigner', () => {
    const publicJwkMock = { kid: 'sigKid', alg: 'ES256' } as JWK;

    beforeEach(() => {
      publicFromPrivateMock.mockResolvedValue(publicJwkMock);
    });

    it('should derive the public JWK from the configured signing key', async () => {
      // When
      await service.getJwtSigner();

      // Then
      expect(publicFromPrivateMock).toHaveBeenCalledExactlyOnceWith(
        signKeyMock,
      );
    });

    it('should return a JWK signer with the alg from the signing key', async () => {
      // When
      const result = await service.getJwtSigner();

      // Then
      expect(result).toEqual({
        method: 'jwk',
        publicJwk: publicJwkMock,
        alg: signKeyMock.alg,
      });
    });
  });

  describe('signJwt', () => {
    const signerMock: JwtSignerInterface = {
      method: 'jwk',
      publicJwk: { kid: 'sigKid' } as JWK,
      alg: 'ES256',
    };
    const jwtMock = {
      payload: { foo: 'bar' },
      header: { alg: 'ES256' },
    };
    const compactJwtMock = 'header.payload.signature';
    const importedKeyMock = Symbol('importedKey') as unknown as KeyLike;
    const signJwtInstanceMock = {
      setProtectedHeader: jest.fn(),
      sign: jest.fn(),
    };

    beforeEach(() => {
      signJwtInstanceMock.setProtectedHeader.mockReturnThis();
      signJwtInstanceMock.sign.mockResolvedValue(compactJwtMock);
      SignJWTMock.mockImplementation(
        () => signJwtInstanceMock as unknown as SignJWT,
      );

      importJWKMock.mockResolvedValue(importedKeyMock);
    });

    it('should import the signing key with the signer algorithm', async () => {
      // When
      await service.signJwt(signerMock, jwtMock);

      // Then
      expect(importJWKMock).toHaveBeenCalledExactlyOnceWith(
        signKeyMock,
        signerMock.alg,
      );
    });

    it('should set the protected header before signing', async () => {
      // When
      await service.signJwt(signerMock, jwtMock);

      // Then
      expect(SignJWTMock).toHaveBeenCalledExactlyOnceWith(jwtMock.payload);
      expect(
        signJwtInstanceMock.setProtectedHeader,
      ).toHaveBeenCalledExactlyOnceWith(jwtMock.header);
    });

    it('should sign the JWT with the imported key', async () => {
      // When
      await service.signJwt(signerMock, jwtMock);

      // Then
      expect(signJwtInstanceMock.sign).toHaveBeenCalledExactlyOnceWith(
        importedKeyMock,
      );
    });

    it('should return the compact JWT and the signer public JWK', async () => {
      // When
      const result = await service.signJwt(signerMock, jwtMock);

      // Then
      expect(result).toEqual({
        jwt: compactJwtMock,
        signerJwk: signerMock.publicJwk,
      });
    });
  });

  describe('verifyJwt', () => {
    const publicKeyMock = { kid: 'sigKid' };
    const jwksMock = { keys: [publicKeyMock] };
    const jwtVerifyResultMock = {
      payload: { iss: 'issuerMock' },
      header: { jwk: publicKeyMock },
      compact: 'compactPart',
    } as unknown as Parameters<Openid4vpCryptoService['verifyJwt']>[1];

    const signerMock: JwtSigner = {
      method: 'jwk',
      publicJwk: { kid: 'sigKid' } as Jwk,
      alg: 'ES256',
    };

    it('should verify the JWT with the configured JWKs and the issuer claim', async () => {
      // When
      await service.verifyJwt(signerMock, jwtVerifyResultMock);

      // Then
      expect(jwtServiceMock.verify).toHaveBeenCalledWith(
        jwtVerifyResultMock.compact,
        'issuerMock',
        jwksMock,
      );
    });

    it('should return a successful verification with the signing JWK', async () => {
      // When
      const result = await service.verifyJwt(signerMock, jwtVerifyResultMock);

      // Then
      expect(result).toEqual({
        verified: true,
        signerJwk: publicKeyMock,
      });
    });
  });

  describe('encryptJwe', () => {
    it('should reject because encryption is not configured yet', async () => {
      // When / Then
      await expect(service.encryptJwe()).rejects.toThrow(
        'OID4VP JAR/JARM encryption callback is not configured yet.',
      );
    });
  });

  describe('decryptJwe', () => {
    const jwkMock = { kid: 'decryptionKid' } as Jwk;
    const decryptedPayloadMock = 'decrypted-payload';

    beforeEach(() => {
      jwtServiceMock.decrypt.mockResolvedValue(decryptedPayloadMock);
    });

    it('should delegate the decryption to the JWT service with the configured JWKs', async () => {
      // When
      await service.decryptJwe('payload', { jwk: jwkMock });

      // Then
      expect(jwtServiceMock.decrypt).toHaveBeenCalledExactlyOnceWith(
        'payload',
        jwksMock,
      );
    });

    it('should return the decrypted payload along with the decryption JWK', async () => {
      // When
      const result = await service.decryptJwe('payload', { jwk: jwkMock });

      // Then
      expect(result).toEqual({
        decrypted: true,
        decryptionJwk: jwkMock,
        payload: decryptedPayloadMock,
      });
    });
  });

  describe('getPublicJwks', () => {
    it('should derive publicKey for each keys of the jwks', async () => {
      // When
      await service.getPublicJwks();

      // Then
      expect(publicFromPrivateMock).toHaveBeenCalledTimes(2);
      expect(publicFromPrivateMock).toHaveBeenNthCalledWith(1, signKeyMock);
      expect(publicFromPrivateMock).toHaveBeenNthCalledWith(2, encKeyMock);
    });

    it('should return the resulting public JWKs wrapped in a JwkSet', async () => {
      // Given
      const pubKey1Mock = { kid: 'publicKid1Mock' } as JWK;
      const pubKey2Mock = { kid: 'publicKid2Mock' } as JWK;
      const expectedPublicJwks = { keys: [pubKey1Mock, pubKey2Mock] };
      publicFromPrivateMock.mockResolvedValueOnce(pubKey1Mock);
      publicFromPrivateMock.mockResolvedValueOnce(pubKey2Mock);

      // When
      const result = await service.getPublicJwks();

      // Then
      expect(result).toEqual(expectedPublicJwks);
    });
  });

  describe('requestCallbacks', () => {
    it('should expose a signJwt callback', () => {
      // Then
      expect(typeof service.requestCallbacks.signJwt).toBe('function');
    });

    it('should expose an encryptJwe callback', () => {
      // Then
      expect(typeof service.requestCallbacks.encryptJwe).toBe('function');
    });
  });

  describe('responseCallbacks', () => {
    it('should expose a decryptJwe callback', () => {
      // Then
      expect(typeof service.responseCallbacks.decryptJwe).toBe('function');
    });

    it('should expose a verifyJwt callback', () => {
      // Then
      expect(typeof service.responseCallbacks.verifyJwt).toBe('function');
    });
  });
});
