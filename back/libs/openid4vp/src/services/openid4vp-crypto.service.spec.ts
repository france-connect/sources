import { createPrivateKey, KeyObject } from 'crypto';

import type { Jwk, JwtSigner } from '@openid4vc/oauth2';
import { exportJWK, importJWK, JWK, KeyLike, SignJWT } from 'jose';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { JwkHelper, JwksDto, JwtService } from '@fc/jwt';

import { getConfigMock } from '@mocks/config';
import { getJwtServiceMock } from '@mocks/jwt';

import { Openid4vpClientIdSchemeEnum } from '../enums';
import { loadX509SigningMaterial } from '../helpers';
import { X509SigningMaterial } from '../interfaces';
import { Openid4vpCryptoService } from './openid4vp-crypto.service';

jest.mock('jose');

jest.mock('@fc/jwt', () => ({
  ...jest.requireActual('@fc/jwt'),
  JwkHelper: {
    publicFromPrivate: jest.fn(),
  },
}));

jest.mock('../helpers', () => ({
  loadX509SigningMaterial: jest.fn(),
}));

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  createPrivateKey: jest.fn(),
}));

describe('Openid4vpCryptoService', () => {
  let service: Openid4vpCryptoService;

  const configMock = getConfigMock();
  const jwtServiceMock = getJwtServiceMock();

  const importJWKMock = jest.mocked(importJWK);
  const SignJWTMock = jest.mocked(SignJWT);
  const publicFromPrivateMock = jest.mocked(JwkHelper.publicFromPrivate);
  const privateKeyMock = Symbol('privateKey') as unknown as KeyObject;

  const signKeyMock = { kid: 'sigKid', alg: 'ES256', use: 'sig' } as JWK;
  const encKeyMock = {
    kid: 'encKid',
    alg: 'ECDH-ES+A256KW',
    use: 'enc',
  } as JWK;
  const jwksMock = { keys: [signKeyMock, encKeyMock] };
  const openid4vpConfigMock = {
    relayingParty: {
      clientIdScheme: Openid4vpClientIdSchemeEnum.REDIRECT_URI,
      clientId: 'https://example.com/redirect/:interactionId',
    },
    jwks: jwksMock,
  };

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    // Given
    const createPrivateKeyMock = jest.mocked(createPrivateKey);

    const x509SigningMaterialMock = {
      privateKeyPem: 'privateKeyPemMock',
    } as unknown as X509SigningMaterial;

    beforeEach(() => {
      service['isX509ClientIdScheme'] = jest.fn().mockReturnValueOnce(true);

      jest
        .mocked(loadX509SigningMaterial)
        .mockReturnValue(x509SigningMaterialMock);
      configMock.get.mockReturnValue({
        ...openid4vpConfigMock,
        x509: {
          certificateChainPem: 'certificateChainPemMock',
          privateKeyPem: 'privateKeyPemMock',
          alg: 'ES256',
        },
      });
    });

    it('should load the x509 signing material', () => {
      // When
      service.onModuleInit();

      // Then
      expect(service['x509SigningMaterial']).toBe(x509SigningMaterialMock);
    });

    it('should create a private key from the x509 signing material', () => {
      // Given
      createPrivateKeyMock.mockReturnValue(privateKeyMock);

      // When
      service.onModuleInit();

      // Then
      expect(createPrivateKeyMock).toHaveBeenCalledExactlyOnceWith({
        key: x509SigningMaterialMock.privateKeyPem,
        format: 'pem',
      });
    });

    it('should not load the x509 signing material nor create a private key if the client id scheme is not x509', () => {
      // Given
      service['isX509ClientIdScheme'] = jest.fn().mockReturnValueOnce(false);

      // When
      service.onModuleInit();

      // Then
      expect(service['x509SigningMaterial']).toBeUndefined();
      expect(service['privateKey']).toBeUndefined();
    });
  });

  describe('getX509ClientId', () => {
    it('should return the x509 client id', () => {
      // Given
      const clientIdMock = Symbol('x509ClientId');
      service['x509SigningMaterial'] = {
        clientIdHash: clientIdMock,
      } as unknown as X509SigningMaterial;

      // When
      const result = service.getX509ClientId();

      // Then
      expect(result).toBe(clientIdMock);
    });
  });

  describe('getJwtSigner', () => {
    const jwkSignerMock = Symbol('jwkSigner') as unknown as JwtSigner;
    const x509SignerMock = Symbol('x509Signer') as unknown as JwtSigner;

    beforeEach(() => {
      service['getJwkSigner'] = jest.fn().mockResolvedValue(jwkSignerMock);
      service['getX509Signer'] = jest.fn().mockReturnValue(x509SignerMock);
    });

    it('should delegate to the getJwkSigner method if the client id scheme is not x509', async () => {
      // Given
      service['isX509ClientIdScheme'] = jest.fn().mockReturnValue(false);

      // When
      const result = await service['getJwtSigner']();

      // Then
      expect(result).toBe(jwkSignerMock);
    });

    it('should return the x509 signer if the client id scheme is x509', async () => {
      // Given
      service['isX509ClientIdScheme'] = jest.fn().mockReturnValue(true);

      // When
      const result = await service['getJwtSigner']();

      // Then
      expect(result).toBe(x509SignerMock);
    });
  });

  describe('getX509Signer', () => {
    it('should return the x509 signer', () => {
      // Given
      service['x509SigningMaterial'] = {
        x5c: 'x5cMock',
        alg: 'ES256',
      } as unknown as X509SigningMaterial;

      const expectedResult = {
        method: 'x5c',
        x5c: 'x5cMock',
        alg: 'ES256',
      } as unknown as JwtSigner;

      // When
      const result = service['getX509Signer']();

      // Then
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getJwkSigner', () => {
    const publicJwkMock = { kid: 'sigKid', alg: 'ES256' } as JWK;

    beforeEach(() => {
      publicFromPrivateMock.mockResolvedValue(publicJwkMock);
    });

    it('should derive the public JWK from the configured signing key', async () => {
      // When
      await service['getJwkSigner']();

      // Then
      expect(publicFromPrivateMock).toHaveBeenCalledExactlyOnceWith(
        signKeyMock,
      );
    });

    it('should return a JWK signer with the alg from the signing key', async () => {
      // When
      const result = await service['getJwkSigner']();

      // Then
      expect(result).toEqual({
        method: 'jwk',
        publicJwk: publicJwkMock,
        alg: signKeyMock.alg,
      });
    });
  });

  describe('signJwt', () => {
    // Given
    const jwtMock = {
      payload: { foo: 'bar' },
      header: { alg: 'ES256' },
    };

    it('should delegate to the signJwtWithJwk method if the signer method is jwk', async () => {
      // Given
      const signerMock = {
        method: 'jwk',
      } as unknown as JwtSigner;
      const jwkSignerMock = Symbol('jwkSigner');
      service['signJwtWithJwk'] = jest.fn().mockResolvedValue(jwkSignerMock);

      // When
      const result = await service['signJwt'](signerMock, jwtMock);

      // Then
      expect(result).toBe(jwkSignerMock);
    });

    it('should delegate to the signJwtWithX5c method if the signer method is x5c', async () => {
      // Given
      const signerMock = {
        method: 'x5c',
      } as unknown as JwtSigner;
      const x5cSignerMock = Symbol('x5cSignerMock');

      service['signJwtWithX5c'] = jest.fn().mockResolvedValue(x5cSignerMock);

      // When
      const result = await service['signJwt'](signerMock, jwtMock);

      // Then
      expect(result).toBe(x5cSignerMock);
    });
  });

  describe('signJwtWithJwk', () => {
    const signerMock = {
      method: 'jwk',
      publicJwk: { kid: 'sigKid' } as Jwk,
      alg: 'ES256',
    } as JwtSigner;
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
      await service['signJwtWithJwk'](signerMock, jwtMock);

      // Then
      expect(importJWKMock).toHaveBeenCalledExactlyOnceWith(
        signKeyMock,
        signerMock.alg,
      );
    });

    it('should set the protected header before signing', async () => {
      // When
      await service['signJwtWithJwk'](signerMock, jwtMock);

      // Then
      expect(SignJWTMock).toHaveBeenCalledExactlyOnceWith(jwtMock.payload);
      expect(
        signJwtInstanceMock.setProtectedHeader,
      ).toHaveBeenCalledExactlyOnceWith(jwtMock.header);
    });

    it('should sign the JWT with the imported key', async () => {
      // When
      await service['signJwtWithJwk'](signerMock, jwtMock);

      // Then
      expect(signJwtInstanceMock.sign).toHaveBeenCalledExactlyOnceWith(
        importedKeyMock,
      );
    });

    it('should return the compact JWT and the signer public JWK', async () => {
      // When
      const result = await service['signJwtWithJwk'](signerMock, jwtMock);

      // Then
      expect(result).toEqual({
        jwt: compactJwtMock,
        signerJwk: (signerMock as { publicJwk: Jwk }).publicJwk,
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
      service['jwks'] = jwksMock as unknown as JwksDto;
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
    beforeEach(() => {
      service['jwks'] = jwksMock as unknown as JwksDto;
    });

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

  describe('isX509ClientIdScheme', () => {
    it('should return true if the client id scheme is x509', () => {
      // Given
      configMock.get.mockReturnValue({
        ...openid4vpConfigMock,
        relayingParty: {
          clientIdScheme: Openid4vpClientIdSchemeEnum.X509_HASH,
        },
      });

      // When
      const result = service['isX509ClientIdScheme']();

      // Then
      expect(result).toBe(true);
    });

    it('should return false if the client id scheme is not x509', () => {
      // Given
      configMock.get.mockReturnValue({
        ...openid4vpConfigMock,
        relayingParty: {
          clientIdScheme: Openid4vpClientIdSchemeEnum.REDIRECT_URI,
        },
      });
      // When
      const result = service['isX509ClientIdScheme']();

      // Then
      expect(result).toBe(false);
    });
  });

  describe('signJwtWithX5c', () => {
    // Given
    const signerMock = {
      method: 'x5c',
    } as unknown as JwtSigner;
    const jwtMock = {
      payload: { foo: 'bar' },
      header: { alg: 'ES256' },
    };

    const exportJWKMock = jest.mocked(exportJWK);
    const signJWTMock = jest.mocked(SignJWT);
    const publicKeyMock = { kid: 'publicKid' } as JWK;
    const signJwtInstanceMock = {
      setProtectedHeader: jest.fn(),
      sign: jest.fn(),
    };
    const compactJwtMock = 'header.payload.signature';

    beforeEach(() => {
      service['x509SigningMaterial'] = {
        privateKeyPem: 'privateKeyPemMock',
        leafCertificate: {
          publicKey: publicKeyMock,
        },
      } as unknown as X509SigningMaterial;

      service['privateKey'] = privateKeyMock;

      exportJWKMock.mockResolvedValue(publicKeyMock);
      signJWTMock.mockImplementation(
        () => signJwtInstanceMock as unknown as SignJWT,
      );

      signJwtInstanceMock.setProtectedHeader.mockReturnThis();
      signJwtInstanceMock.sign.mockResolvedValue(compactJwtMock);
    });

    it('should export the public key from the x509 signing material', async () => {
      // When
      await service['signJwtWithX5c'](signerMock, jwtMock);

      // Then
      expect(exportJWKMock).toHaveBeenCalledExactlyOnceWith(publicKeyMock);
    });

    it('should sign the JWT with the x509 signing material', async () => {
      // When
      await service['signJwtWithX5c'](signerMock, jwtMock);

      // Then
      expect(signJwtInstanceMock.sign).toHaveBeenCalledExactlyOnceWith(
        privateKeyMock,
      );
    });

    it('should return the compact JWT and the signer public JWK', async () => {
      // When
      const result = await service['signJwtWithX5c'](signerMock, jwtMock);

      // Then
      expect(result).toEqual({
        jwt: compactJwtMock,
        signerJwk: publicKeyMock,
      });
    });
  });
});
