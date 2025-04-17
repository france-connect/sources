import { ValidationError } from 'class-validator';
import {
  compactDecrypt,
  CompactDecryptResult,
  CompactEncrypt,
  decodeProtectedHeader,
  importJWK,
  JSONWebKeySet,
  JWK,
  jwtVerify,
  JWTVerifyResult,
  KeyLike,
  ResolvedKey,
  SignJWT,
} from 'jose';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { DekAlg, KekAlg, Use } from '@fc/cryptography';
import { FetchJwksFailedException } from '@fc/jwt/exceptions/fetch-jwks-failed.exception';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import {
  CanNotDecodePlaintextException,
  CanNotDecodeProtectedHeaderException,
  CanNotDecryptException,
  CanNotEncryptException,
  CanNotImportJwkException,
  CanNotSignJwtException,
  InvalidJwksException,
  InvalidSignatureException,
  MultipleRelevantKeysException,
  NoRelevantKeyException,
} from '../exceptions';
import { JwtService } from './jwt.service';

jest.mock('jose');
jest.mock('rxjs');
jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
}));

const httpServiceMock = {
  get: jest.fn(),
};

const loggerServiceMock = getLoggerMock();

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService, JwtService, HttpService],
    })
      .overrideProvider(HttpService)
      .useValue(httpServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<JwtService>(JwtService);
  });

  describe('getFirstRelevantKey', () => {
    // Given
    const key1 = { alg: 'RS256', use: 'sig' };
    const key2 = { alg: 'ES256', use: 'sig', kid: 'foo' };
    const key3 = { alg: 'ES256', use: 'enc', kid: 'foo' };
    const key4 = { alg: 'FOO', use: 'enc' };

    const jwks = {
      keys: [key1, key2, key3, key4],
    } as unknown as JSONWebKeySet;

    it('should return the first relevant key (sig)', () => {
      // Given
      const alg = KekAlg.ES256;
      const use = Use.SIG;

      // When
      const result = service.getFirstRelevantKey(jwks, alg, use);

      // Then
      expect(result).toEqual(key2);
    });

    it('should return the first relevant key (enc)', () => {
      // Given
      const alg = KekAlg.ES256;
      const use = Use.ENC;

      // When
      const result = service.getFirstRelevantKey(jwks, alg, use);

      // Then
      expect(result).toEqual(key3);
    });

    it('should throw an error if no relevant key is found', () => {
      // Given
      const alg = KekAlg.HS256;
      const use = Use.SIG;

      // When
      const result = () => service.getFirstRelevantKey(jwks, alg, use);

      // Then
      expect(result).toThrow(NoRelevantKeyException);
    });

    it('should throw an error if multiple relevant key are found when a kid is provided', () => {
      // Given
      const alg = KekAlg.ES256;
      const use = Use.SIG;
      const kid = 'foo';

      const jwksMultipleRelevantKeys = {
        keys: [...jwks.keys, { alg, use, kid }],
      } as unknown as JSONWebKeySet;

      // When
      const result = () =>
        service.getFirstRelevantKey(jwksMultipleRelevantKeys, alg, use, kid);

      // Then
      expect(result).toThrow(MultipleRelevantKeysException);
    });

    it('should return the first relevant key (with kid)', () => {
      // Given
      const alg = KekAlg.ES256;
      const use = Use.SIG;
      const kid = 'foo';

      // When
      const result = service.getFirstRelevantKey(jwks, alg, use, kid);

      // Then
      expect(result).toEqual(key2);
    });
  });

  describe('getKeyForToken', () => {
    // Given
    const jwt = 'foo';
    const jwks = { keys: [] };
    const use = Use.SIG;

    it('should return result from getFirstRelevantKey', () => {
      // Given
      const key = { alg: 'RS256', use: 'sig' };
      service['getFirstRelevantKey'] = jest.fn().mockReturnValue(key);
      service['retrieveJwtHeaders'] = jest.fn().mockReturnValueOnce({
        alg: 'RS256',
      });
      // When
      const result = service.getKeyForToken(jwt, jwks, use);

      // Then
      expect(result).toBe(key);
    });
  });

  describe('encrypt', () => {
    // Given
    const payload = 'foo';
    const jwk = { alg: 'RS256', use: 'sig' } as unknown as JWK;
    const encoding = DekAlg.A256GCM;

    const compactEncryptMockInstance = {
      setProtectedHeader: jest.fn(),
      encrypt: jest.fn(),
    };
    const compactEncryptMock = function () {
      return compactEncryptMockInstance as unknown as CompactEncrypt;
    };

    beforeEach(() => {
      jest.mocked(CompactEncrypt).mockImplementation(compactEncryptMock);
      // .mockReturnValue(compactEncryptMock as unknown as CompactEncrypt);

      compactEncryptMockInstance.setProtectedHeader.mockReturnValue(
        compactEncryptMockInstance,
      );
      compactEncryptMockInstance.encrypt.mockResolvedValue(
        compactEncryptMockInstance,
      );
      service['importJwk'] = jest.fn().mockResolvedValue(jwk);
    });

    it('should call this.importJWK', async () => {
      // When
      await service.encrypt(payload, jwk, encoding);

      // Then
      expect(service['importJwk']).toHaveBeenCalledWith(jwk);
    });

    it('should instantiate CompactEncrypt and call setProtectedHeader() and encrypt()', async () => {
      // Given
      const key = Symbol('key');
      service['importJwk'] = jest.fn().mockResolvedValue(key);

      // When
      await service.encrypt(payload, jwk, encoding);

      // Then
      expect(
        compactEncryptMockInstance.setProtectedHeader,
      ).toHaveBeenCalledTimes(1);
      expect(
        compactEncryptMockInstance.setProtectedHeader,
      ).toHaveBeenCalledWith({ alg: 'RS256', enc: 'A256GCM' });

      expect(compactEncryptMockInstance.encrypt).toHaveBeenCalledTimes(1);
      expect(compactEncryptMockInstance.encrypt).toHaveBeenCalledWith(key);
    });

    it('should throw if compactEncrypt.encrypt() throws', async () => {
      // Given
      const error = new Error('foo');
      compactEncryptMockInstance.encrypt.mockRejectedValueOnce(error);

      // When / Then
      await expect(service.encrypt(payload, jwk, encoding)).rejects.toThrow(
        CanNotEncryptException,
      );
    });
  });

  describe('decrypt', () => {
    const jwt = 'foo';
    const jwks = { keys: [] };
    const jwk = { alg: 'RS256', use: 'sig' };
    const key = Symbol('key');

    const clearPlaintext = 'foo';
    const compactDecryptReturnValue = {
      plaintext: new TextEncoder().encode(clearPlaintext),
    } as unknown as CompactDecryptResult & ResolvedKey;
    const compactDecryptMock = jest.mocked(compactDecrypt);

    beforeEach(() => {
      compactDecryptMock.mockResolvedValue(compactDecryptReturnValue);
      service['getKeyForToken'] = jest.fn().mockReturnValue(jwk);
      service['importJwk'] = jest.fn().mockResolvedValue(key);
    });

    it('should call this.getKeyForToken()', async () => {
      // When
      await service.decrypt(jwt, jwks);
      // Then
      expect(service.getKeyForToken).toHaveBeenCalledWith(jwt, jwks, 'enc');
    });

    it('should call this.importJwk()', async () => {
      // When
      await service.decrypt(jwt, jwks);
      // Then
      expect(service['importJwk']).toHaveBeenCalledWith(jwk);
    });

    it('should call compactDecrypt()', async () => {
      // When
      await service.decrypt(jwt, jwks);
      // Then
      expect(compactDecryptMock).toHaveBeenCalledWith(jwt, key);
    });

    it('should throw CanNotDecryptException if compactDecrypt() throws', async () => {
      // Given
      const error = new Error('foo');
      compactDecryptMock.mockRejectedValueOnce(error);
      // When / Then
      await expect(service.decrypt(jwt, jwks)).rejects.toThrow(
        CanNotDecryptException,
      );
    });

    it('should return decoded plaintext', async () => {
      // When
      const result = await service.decrypt(jwt, jwks);
      // Then
      expect(result).toEqual(clearPlaintext);
    });

    it('should throw if plaintext is not decodable by TextDecoder', async () => {
      // Given
      compactDecryptReturnValue.plaintext =
        'not a valid UInt8Array' as unknown as Uint8Array;
      // When / Then
      await expect(service.decrypt(jwt, jwks)).rejects.toThrow(
        CanNotDecodePlaintextException,
      );
    });
  });

  describe('sign', () => {
    // Given
    const payload = { foo: 'bar' };
    const issuer = 'https://issuer.com';
    const audience = 'client_id';
    const jwk = { alg: 'RS256', use: 'sig' } as JWK;
    const key = Symbol('key');

    const signResult = 'foo';
    const signJWTInstance = {
      setProtectedHeader: jest.fn(),
      setIssuedAt: jest.fn(),
      setIssuer: jest.fn(),
      setAudience: jest.fn(),
      sign: jest.fn(),
    };
    const signJwtMock = function () {
      return signJWTInstance as unknown as SignJWT;
    };

    beforeEach(() => {
      service['importJwk'] = jest.fn().mockResolvedValue(key);
      jest.mocked(SignJWT).mockImplementation(signJwtMock);

      signJWTInstance.setProtectedHeader.mockReturnValue(signJWTInstance);
      signJWTInstance.setIssuedAt.mockReturnValue(signJWTInstance);
      signJWTInstance.setIssuer.mockReturnValue(signJWTInstance);
      signJWTInstance.setAudience.mockReturnValue(signJWTInstance);
      signJWTInstance.sign.mockResolvedValue(signResult);
    });

    it('should call this.importJwk()', async () => {
      // When
      await service.sign(payload, issuer, audience, jwk);

      // Then
      expect(service['importJwk']).toHaveBeenCalledTimes(1);
      expect(service['importJwk']).toHaveBeenCalledWith(jwk);
    });

    it('should instantiate SignJWT and call setProtectedHeader, setIssuedAt, setIssuer and sign', async () => {
      // When
      await service.sign(payload, issuer, audience, jwk);

      // Then
      expect(signJWTInstance.setProtectedHeader).toHaveBeenCalledTimes(1);
      expect(signJWTInstance.setProtectedHeader).toHaveBeenCalledWith({
        alg: 'RS256',
      });

      expect(signJWTInstance.setIssuedAt).toHaveBeenCalledTimes(1);
      expect(signJWTInstance.setIssuedAt).toHaveBeenCalledWith();

      expect(signJWTInstance.setIssuer).toHaveBeenCalledTimes(1);
      expect(signJWTInstance.setIssuer).toHaveBeenCalledWith(issuer);

      expect(signJWTInstance.setAudience).toHaveBeenCalledTimes(1);
      expect(signJWTInstance.setAudience).toHaveBeenCalledWith(audience);

      expect(signJWTInstance.sign).toHaveBeenCalledTimes(1);
      expect(signJWTInstance.sign).toHaveBeenCalledWith(key);
    });

    it('should instantiate SignJWT and call setProtectedHeader with a kid, setIssuedAt, setIssuer and sign', async () => {
      // Given
      const kidExpectedValue = 'NewKidValue12345';
      const jwkWithKid = {
        kid: kidExpectedValue,
        ...jwk,
      };

      // When
      await service.sign(payload, issuer, audience, jwkWithKid);

      // Then
      expect(signJWTInstance.setProtectedHeader).toHaveBeenCalledTimes(1);
      expect(signJWTInstance.setProtectedHeader).toHaveBeenCalledWith({
        alg: 'RS256',
        kid: kidExpectedValue,
      });

      expect(signJWTInstance.setIssuedAt).toHaveBeenCalledTimes(1);
      expect(signJWTInstance.setIssuedAt).toHaveBeenCalledWith();

      expect(signJWTInstance.setIssuer).toHaveBeenCalledTimes(1);
      expect(signJWTInstance.setIssuer).toHaveBeenCalledWith(issuer);

      expect(signJWTInstance.sign).toHaveBeenCalledTimes(1);
      expect(signJWTInstance.sign).toHaveBeenCalledWith(key);
    });

    it('should throw CanNotSignJwtException if signJWT.sign() throws', async () => {
      // Given
      const error = new Error('foo');
      signJWTInstance.sign.mockRejectedValueOnce(error);

      // When / Then
      await expect(
        service.sign(payload, issuer, audience, jwk),
      ).rejects.toThrow(CanNotSignJwtException);
    });

    it('should return the result of signJWT.sign()', async () => {
      // When
      const result = await service.sign(payload, issuer, audience, jwk);

      // Then
      expect(result).toEqual(signResult);
    });
  });

  describe('verify', () => {
    const jwt = 'foo.bar.baz';
    const issuer = 'https://issuer.com';
    const jwk = { alg: 'RS256', use: 'sig' };
    const jwks = [jwk] as unknown as JSONWebKeySet;
    const key = Symbol('key');
    const payloadValue = 'bar';
    const verifiedData = {
      payload: payloadValue,
    } as unknown as JWTVerifyResult & ResolvedKey;

    beforeEach(() => {
      service['getKeyForToken'] = jest.fn().mockReturnValue(jwk);
      service['importJwk'] = jest.fn().mockResolvedValue(key);
      jest.mocked(jwtVerify).mockResolvedValueOnce(verifiedData);
    });

    it('should call this.getKeyForToken()', async () => {
      // When
      await service.verify(jwt, issuer, jwks);

      // Then
      expect(service.getKeyForToken).toHaveBeenCalledTimes(1);
      expect(service.getKeyForToken).toHaveBeenCalledWith(jwt, jwks, 'sig');
    });

    it('should call this.importJwk()', async () => {
      // When
      await service.verify(jwt, issuer, jwks);

      // Then
      expect(service['importJwk']).toHaveBeenCalledTimes(1);
      expect(service['importJwk']).toHaveBeenCalledWith(jwk);
    });

    it('should call jwtVerify()', async () => {
      // When
      await service.verify(jwt, issuer, jwks);

      // Then
      expect(jwtVerify).toHaveBeenCalledTimes(1);
      expect(jwtVerify).toHaveBeenCalledWith(jwt, key, {
        issuer,
      });
    });

    it('should throw SignatureNotVerifiedException if jwtVerify() throws', async () => {
      // Given
      const error = new Error('foo');
      jest.mocked(jwtVerify).mockReset().mockRejectedValueOnce(error);

      // When / Then
      await expect(service.verify(jwt, issuer, jwks)).rejects.toThrow(
        InvalidSignatureException,
      );
    });

    it('should return the result of jwtVerify()', async () => {
      // When
      const result = await service.verify(jwt, issuer, jwks);

      // Then
      expect(result).toEqual(payloadValue);
    });
  });

  describe('importJwk', () => {
    const jwk = { alg: 'RS256', use: 'sig' } as JWK;
    const key = Symbol('key') as unknown as KeyLike | Uint8Array;
    const importJWKMock = jest.mocked(importJWK);

    beforeEach(() => {
      importJWKMock.mockResolvedValue(key);
    });

    it('should call importJWK() with the given jwk', async () => {
      // When
      await service['importJwk'](jwk);

      // Then
      expect(importJWKMock).toHaveBeenCalledTimes(1);
      expect(importJWKMock).toHaveBeenCalledWith(jwk);
    });

    it('should throw CanNotImportJwkException if importJWK() throws', async () => {
      // Given
      const error = new Error('foo');
      importJWKMock.mockReset().mockRejectedValueOnce(error);

      // When / Then
      await expect(service['importJwk'](jwk)).rejects.toThrow(
        CanNotImportJwkException,
      );
    });

    it('should return the result of importJWK()', async () => {
      // When
      const result = await service['importJwk'](jwk);

      // Then
      expect(result).toEqual(key);
    });
  });

  describe('retrieveJwtHeaders', () => {
    // Given
    const jwt = 'foo';

    it('should throw an error if the protected header can not be decoded', () => {
      // Given
      jest.mocked(decodeProtectedHeader).mockImplementationOnce(() => {
        throw new Error('foo');
      });

      // When / Then
      expect(() => service.retrieveJwtHeaders(jwt)).toThrow(
        CanNotDecodeProtectedHeaderException,
      );
    });

    it('should return result from getFirstRelevantKey', () => {
      // Given
      const headers = { alg: 'RS256' };
      jest.mocked(decodeProtectedHeader).mockReturnValueOnce({
        alg: 'RS256',
      });

      // When
      const result = service.retrieveJwtHeaders(jwt);

      // Then
      expect(result).toEqual(headers);
    });
  });

  describe('fetchJwks', () => {
    it('should call the signkeys endpoint with the given URL', async () => {
      // Given
      const urlMock = 'url';
      jest.mocked(lastValueFrom).mockResolvedValue({ data: 'data' });
      jest.mocked(validateDto).mockResolvedValue([]);

      // When
      await service['fetchJwks'](urlMock);

      // Then
      expect(httpServiceMock.get).toHaveBeenCalledTimes(1);
      expect(httpServiceMock.get).toHaveBeenCalledWith(urlMock);
    });

    it('should throw if fetch fails', async () => {
      // Given
      const urlMock = 'url';
      const errorMock = new Error('error');
      jest.mocked(lastValueFrom).mockRejectedValue(errorMock);
      jest.mocked(validateDto).mockResolvedValue([]);

      // When / Then
      await expect(service['fetchJwks'](urlMock)).rejects.toThrow(
        FetchJwksFailedException,
      );
    });

    it('should throw if the jwks is invalid', async () => {
      // Given
      const urlMock = 'url';
      const responseMock = { data: 'data' };
      const validationError: ValidationError = {
        target: {},
        property: 'keys',
        children: [],
        constraints: { isArray: 'keys must be an array' },
      };
      jest.mocked(lastValueFrom).mockResolvedValue(responseMock);
      jest.mocked(validateDto).mockResolvedValue([validationError]);

      // When / Then
      await expect(service['fetchJwks'](urlMock)).rejects.toThrow(
        InvalidJwksException,
      );
      expect(loggerServiceMock.debug).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.debug).toHaveBeenCalledWith(
        [validationError],
        'The JWKS format is invalid',
      );
    });

    it('should return the response data', async () => {
      // Given
      const urlMock = 'url';
      const responseMock = { data: 'data' };
      jest.mocked(lastValueFrom).mockResolvedValue(responseMock);
      jest.mocked(validateDto).mockResolvedValue([]);

      // When
      const result = await service['fetchJwks'](urlMock);

      // Then
      expect(result).toStrictEqual(responseMock.data);
    });
  });
});
