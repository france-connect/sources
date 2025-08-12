import * as crypto from 'crypto';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import {
  CryptographyService,
  RANDOM_MIN_ENTROPY,
} from './cryptography.service';
import { LowEntropyArgumentException, PasswordHashFailure } from './exceptions';

describe('CryptographyService', () => {
  let service: CryptographyService;

  const mockEncryptKey = 'p@ss p@rt0ut';
  const mockData = {
    given_name: 'Chuck',
    family_name: 'NORRIS',
  };
  const mockDataToEncrypt = JSON.stringify(mockData);
  const mockDecryptedData = mockDataToEncrypt;

  const mockRandomBytes12 = Buffer.from('424242424242', 'utf8');
  const mockAuthTag16 = Buffer.from('2121212121212121', 'utf8');
  const mockCiphertext = Buffer.from(
    "Chuck Norris cannot be ciphered, it's the cipher who is chuck-norissed",
    'utf8',
  );
  const mockCipher = Buffer.concat([
    mockRandomBytes12,
    mockAuthTag16,
    mockCiphertext,
  ]);

  const mockHashDigestedHash =
    'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8';

  const mockCrypto = {
    randomBytes: jest.fn(),
    createHash: jest.fn(),
    createHmac: jest.fn(),
    createCipheriv: jest.fn(),
    createDecipheriv: jest.fn(),
    pbkdf2: jest.fn(),
  };

  const mockCipherGcm = {
    update: jest.fn(),
    final: jest.fn(),
    getAuthTag: jest.fn(),
  };

  const mockDecipherGcm = {
    update: jest.fn(),
    setAuthTag: jest.fn(),
    final: jest.fn(),
  };

  const mockHash = {
    update: jest.fn(),
    digest: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptographyService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile();

    service = module.get<CryptographyService>(CryptographyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('encryptSymetric', () => {
    beforeEach(() => {
      service['encrypt'] = jest.fn().mockReturnValueOnce(mockCipher);
    });

    it('should serialize the given data and encrypt it calling "this.encrypt"', () => {
      // When
      service.encryptSymetric(mockEncryptKey, mockDataToEncrypt);

      // Then
      expect(service['encrypt']).toHaveBeenCalledTimes(1);
      expect(service['encrypt']).toHaveBeenCalledWith(
        mockEncryptKey,
        mockDataToEncrypt,
      );
    });

    it('should return a base64 encoded string containing "nonce", "authTag" and "ciphertext" in this order', () => {
      // Given
      const finalCipher = Buffer.concat([
        mockRandomBytes12,
        mockAuthTag16,
        mockCiphertext,
      ]).toString('base64');

      // When
      const result = service.encryptSymetric(mockEncryptKey, mockDataToEncrypt);

      // Then
      expect(result).toEqual(finalCipher);
    });
  });

  describe('decryptSymetric', () => {
    it('should decrypt the given ciphertext calling "this.decrypt" and deserialize it', () => {
      // Given
      service['decrypt'] = jest.fn().mockReturnValueOnce(mockDataToEncrypt);

      // When
      const result = service.decryptSymetric(
        mockEncryptKey,
        mockCipher.toString('base64'),
      );

      // Then
      expect(service['decrypt']).toHaveBeenCalledTimes(1);
      expect(service['decrypt']).toHaveBeenCalledWith(
        mockEncryptKey,
        mockCipher,
      );
      expect(result).toBe(mockDataToEncrypt);
    });
  });

  describe('hash', () => {
    beforeEach(() => {
      jest
        .spyOn(crypto, 'createHash')
        .mockImplementationOnce(mockCrypto.createHash);
      mockCrypto.createHash.mockReturnValueOnce(mockHash);

      mockHash.digest.mockReturnValueOnce(mockHashDigestedHash);
    });

    it('should create a Hash instance with the given algorithm', () => {
      // Given
      const data = 'someStringToHashBuddyIfYouMay/IMeanObeyNow/FasterForest';
      const inputEncoding = 'utf8';
      const alg = 'sha256';
      const outputDigest = 'hex';

      // When
      service.hash(data, inputEncoding, alg, outputDigest);

      // Then
      expect(mockCrypto.createHash).toHaveBeenCalledTimes(1);
      expect(mockCrypto.createHash).toHaveBeenCalledWith('sha256');
    });

    it('should create a Hash instance with sha256 if no algorythm is given', () => {
      // Given
      const data = 'someStringToHashBuddyIfYouMay/IMeanObeyNow/FasterForest';
      const inputEncoding = 'utf8';
      const alg = undefined;
      const outputDigest = 'hex';

      // When
      service.hash(data, inputEncoding, alg, outputDigest);

      // Then
      expect(mockCrypto.createHash).toHaveBeenCalledTimes(1);
      expect(mockCrypto.createHash).toHaveBeenCalledWith('sha256');
    });

    it('should call hash instance update with data and given input encoding', () => {
      // Given
      const data = 'someStringToHashBuddyIfYouMay/IMeanObeyNow/FasterForest';
      const inputEncoding = 'binary';
      const alg = 'sha256';
      const outputDigest = 'hex';

      // When
      service.hash(data, inputEncoding, alg, outputDigest);

      // Then
      expect(mockHash.update).toHaveBeenCalledTimes(1);
      expect(mockHash.update).toHaveBeenCalledWith(data, 'binary');
    });

    it('should call hash instance update with data and default input encoding', () => {
      // Given
      const data = 'someStringToHashBuddyIfYouMay/IMeanObeyNow/FasterForest';
      const inputEncoding = undefined;
      const alg = 'sha256';
      const outputDigest = 'hex';

      // When
      service.hash(data, inputEncoding, alg, outputDigest);

      // Then
      expect(mockHash.update).toHaveBeenCalledTimes(1);
      expect(mockHash.update).toHaveBeenCalledWith(data, 'utf8');
    });

    it('should digest the hash to given format', () => {
      // Given
      const data = 'someStringToHashBuddyIfYouMay/IMeanObeyNow/FasterForest';
      const inputEncoding = 'utf8';
      const alg = 'sha256';
      const outputDigest = 'base64';

      // When
      service.hash(data, inputEncoding, alg, outputDigest);

      // Then
      expect(mockHash.digest).toHaveBeenCalledTimes(1);
      expect(mockHash.digest).toHaveBeenCalledWith('base64');
    });

    it('should digest the hash to hex format', () => {
      // Given
      const data = 'someStringToHashBuddyIfYouMay/IMeanObeyNow/FasterForest';
      const inputEncoding = 'utf8';
      const alg = 'sha256';
      const outputDigest = undefined;

      // When
      service.hash(data, inputEncoding, alg, outputDigest);

      // Then
      expect(mockHash.digest).toHaveBeenCalledTimes(1);
      expect(mockHash.digest).toHaveBeenCalledWith('hex');
    });

    it('should return the digested hash', () => {
      // Given
      const data = 'someStringToHashBuddyIfYouMay/IMeanObeyNow/FasterForest';
      const inputEncoding = 'utf8';
      const alg = 'sha256';
      const outputDigest = 'hex';

      // When
      const result = service.hash(data, inputEncoding, alg, outputDigest);

      // Then
      expect(result).toEqual(mockHashDigestedHash);
    });
  });

  describe('hmac', () => {
    // Given
    const hmacMock = {
      update: jest.fn(),
      digest: jest.fn(),
    };

    let createHmacSpy: jest.SpyInstance;

    const data = 'someString';
    const key = 'someKey';

    beforeEach(() => {
      createHmacSpy = jest.spyOn(crypto, 'createHmac');
      createHmacSpy.mockReturnValue(
        hmacMock as unknown as ReturnType<typeof crypto.createHmac>,
      );
    });

    it('should create a Hmac instance with the given algorithm', () => {
      // When
      service.hmac(data, key);

      // Then
      expect(createHmacSpy).toHaveBeenCalledExactlyOnceWith('sha256', key);
    });

    it('should update hmac with data and given input encoding', () => {
      // When
      service.hmac(data, key);

      // Then
      expect(hmacMock.update).toHaveBeenCalledExactlyOnceWith(data, 'utf8');
    });

    it('should make a digest of the hmac to given format', () => {
      // When
      service.hmac(data, key, 'utf8', 'base64');

      // Then
      expect(hmacMock.digest).toHaveBeenCalledExactlyOnceWith('hex');
    });

    it('should return the digested hmac', () => {
      // Given
      const expectedDigest = 'someExpectedDigest';
      hmacMock.digest.mockReturnValueOnce(expectedDigest);

      // When
      const result = service.hmac(data, key);

      // Then
      expect(result).toEqual(expectedDigest);
    });

    it('should allow to specify input encoding, alg, and digest', () => {
      // Given
      const inputEncoding = 'binary';
      const alg = 'sha512';
      const outputDigest = 'base64';

      // When
      service.hmac(data, key, inputEncoding, alg, outputDigest);

      // Then
      expect(createHmacSpy).toHaveBeenCalledExactlyOnceWith(alg, key);
      expect(hmacMock.update).toHaveBeenCalledExactlyOnceWith(
        data,
        inputEncoding,
      );
      expect(hmacMock.digest).toHaveBeenCalledExactlyOnceWith(outputDigest);
    });
  });

  describe('genRandomString', () => {
    it('should return a string the expected number of bytes', () => {
      // Given
      const lengthMock = 42;
      // When
      const result = service.genRandomString(lengthMock);
      // Then
      expect(Buffer.from(result, 'hex')).toHaveLength(42);
    });

    it('should call crypto.randomBytes with config parameter', () => {
      // Given
      const lengthMock = 42;
      const spy = jest.spyOn(crypto, 'randomBytes');
      // When
      service.genRandomString(lengthMock);
      // Then
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(42);
    });

    it('should return result from crypto.randomBytes', () => {
      // Given
      const lengthMock = 32;
      const value = Buffer.from('foobar', 'utf8');
      const valueAsHex = value.toString('hex');
      jest.spyOn(crypto, 'randomBytes').mockImplementationOnce(() => value);
      // When
      const result = service.genRandomString(lengthMock);
      // Then
      expect(result).toBe(valueAsHex);
    });

    it('should throw if length is lower than RANDOM_MIN_ENTROPY', () => {
      // Given
      const lengthMock = RANDOM_MIN_ENTROPY - 1;
      // Then
      expect(() => service.genRandomString(lengthMock)).toThrow(
        LowEntropyArgumentException,
      );
    });
  });

  describe('encrypt', () => {
    beforeEach(() => {
      jest
        .spyOn(crypto, 'randomBytes')
        .mockImplementationOnce(mockCrypto.randomBytes);
      mockCrypto.randomBytes.mockReturnValueOnce(mockRandomBytes12);

      jest
        .spyOn(crypto, 'createCipheriv')
        .mockImplementationOnce(mockCrypto.createCipheriv);
      mockCrypto.createCipheriv.mockReturnValueOnce(mockCipherGcm);
      mockCipherGcm.update.mockReturnValueOnce(mockCiphertext);
      mockCipherGcm.getAuthTag.mockReturnValueOnce(mockAuthTag16);
    });

    it('should generate a 12 bytes nonce by calling crypto.randomBytes', () => {
      // Given
      const randomBytesSize = 12;

      // When
      service['encrypt'](mockEncryptKey, mockDataToEncrypt);

      // Then
      expect(mockCrypto.randomBytes).toHaveBeenCalledTimes(1);
      expect(mockCrypto.randomBytes).toHaveBeenCalledWith(randomBytesSize);
    });

    it('should create a cipher instance with aes-256-gcm and 16 bytes authTag', () => {
      // When
      service['encrypt'](mockEncryptKey, mockDataToEncrypt);

      // Then
      expect(mockCrypto.createCipheriv).toHaveBeenCalledTimes(1);
      expect(mockCrypto.createCipheriv).toHaveBeenCalledWith(
        'aes-256-gcm',
        mockEncryptKey,
        mockRandomBytes12,
        {
          authTagLength: 16,
        },
      );
    });

    it('should encrypt the given data using the cipher instance', () => {
      // When
      service['encrypt'](mockEncryptKey, mockDataToEncrypt);

      // Then
      expect(mockCipherGcm.update).toHaveBeenCalledTimes(1);
      expect(mockCipherGcm.update).toHaveBeenCalledWith(
        mockDataToEncrypt,
        'utf8',
      );
      expect(mockCipherGcm.final).toHaveBeenCalledTimes(1);
    });

    it('should get the authTag from the cipher instance', () => {
      // When
      service['encrypt'](mockEncryptKey, mockDataToEncrypt);

      // Then
      expect(mockCipherGcm.getAuthTag).toHaveBeenCalledTimes(1);
    });

    it('should return a buffer containing "nonce", "authTag" and "ciphertext" in this order', () => {
      // When
      const result = service['encrypt'](mockEncryptKey, mockDataToEncrypt);

      // Then
      expect(result).toMatchObject(
        Buffer.concat([mockRandomBytes12, mockAuthTag16, mockCiphertext]),
      );
    });
  });

  describe('decrypt', () => {
    beforeEach(() => {
      jest
        .spyOn(crypto, 'createDecipheriv')
        .mockImplementationOnce(mockCrypto.createDecipheriv);
      mockCrypto.createDecipheriv.mockReturnValueOnce(mockDecipherGcm);
      mockDecipherGcm.update.mockReturnValueOnce(mockDecryptedData);
    });

    it('should throw an error when given cipher length is lower than cipher head length', () => {
      // Given
      const WRONG_CIPHER = Buffer.from('LOWER_THAN_28_BYTES_STRING', 'utf8');

      // When
      try {
        service['decrypt'](mockEncryptKey, WRONG_CIPHER);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe('Authentication failed !');
      }

      // Then
      expect.hasAssertions();
    });

    it('should throw an error when given cipher length is equal to cipher head length', () => {
      // Given
      const WRONG_CIPHER = Buffer.from('------28_BYTES_STRING-------', 'utf8');

      // When
      try {
        service['decrypt'](mockEncryptKey, WRONG_CIPHER);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe('Authentication failed !');
      }

      // Then
      expect.hasAssertions();
    });

    it('should create a decipher instance with aes-256-gcm and 16 bytes authTag', () => {
      // When
      service['decrypt'](mockEncryptKey, mockCipher);

      // Then
      expect(mockCrypto.createDecipheriv).toHaveBeenCalledTimes(1);
      expect(mockCrypto.createDecipheriv).toHaveBeenCalledWith(
        'aes-256-gcm',
        mockEncryptKey,
        mockRandomBytes12,
        {
          authTagLength: 16,
        },
      );
    });

    it('should set authenthication tag retrieved from the cipher', () => {
      // When
      service['decrypt'](mockEncryptKey, mockCipher);

      // Then
      expect(mockDecipherGcm.setAuthTag).toHaveBeenCalledTimes(1);
      expect(mockDecipherGcm.setAuthTag).toHaveBeenCalledWith(mockAuthTag16);
    });

    it('should decrypt the given ciphertext using the cipher instance', () => {
      // When
      const result = service['decrypt'](mockEncryptKey, mockCipher);

      // Then
      expect(mockDecipherGcm.update).toHaveBeenCalledTimes(1);
      expect(mockDecipherGcm.update).toHaveBeenCalledWith(
        mockCiphertext,
        null,
        'utf8',
      );
      expect(mockDecipherGcm.final).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(mockDataToEncrypt);
    });

    it('should throw authentication error when cipher final fail', () => {
      // Given
      mockDecipherGcm.final.mockImplementationOnce(() => {
        throw new Error('Christmas is cancelled !');
      });

      // When
      try {
        service['decrypt'](mockEncryptKey, mockCipher);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe('Authentication failed !');
      }

      // Then
      expect.hasAssertions();
    });
  });

  describe('passwordHash', () => {
    const password = 'securedPassword';
    const passwordSalt = '!&2Q?MT=BlM*XYr';
    const hashedPassword = '6d6f636b4465726976617465644b6579';
    const mockDerivatedKey = Buffer.from('mockDerivatedKey');

    beforeEach(() => {
      mockConfigService.get.mockReturnValueOnce({ passwordSalt });
    });

    it('should retrieve passwordSalt from config', async () => {
      // Given
      jest.spyOn(crypto, 'pbkdf2').mockImplementationOnce(
        // mocking a native function
        // eslint-disable-next-line max-params
        (_password, _salt, _iterations, _keylen, _digest, callback) => {
          callback(undefined, mockDerivatedKey);
        },
      );

      // When
      await service.passwordHash(password);

      // Then
      expect(mockConfigService.get).toHaveBeenCalledTimes(1);
    });

    it('should resolve with a hashed password', async () => {
      // Given
      const mockPbkdf2 = jest.spyOn(crypto, 'pbkdf2').mockImplementationOnce(
        // mocking a native function
        // eslint-disable-next-line max-params
        (_password, _salt, _iterations, _keylen, _digest, callback) => {
          callback(undefined, mockDerivatedKey);
        },
      );

      // When
      const result = await service.passwordHash(password);

      // Then
      expect(mockPbkdf2).toHaveBeenCalledTimes(1);
      expect(mockPbkdf2).toHaveBeenCalledWith(
        password,
        passwordSalt,
        100000,
        64,
        'sha512',
        expect.any(Function),
      );
      expect(result).toEqual(hashedPassword);
    });

    it('should reject with error PasswordHashFailure if the password is not generated', async () => {
      // Given
      const failure = new Error('password hash failed');
      jest.spyOn(crypto, 'pbkdf2').mockImplementationOnce(
        // mocking a native function
        // eslint-disable-next-line max-params
        (_password, _salt, _iterations, _keylen, _digest, callback) => {
          callback(failure, undefined);
        },
      );

      // When / Then
      await expect(service.passwordHash(password)).rejects.toThrowError(
        PasswordHashFailure,
      );
    });
  });
});
