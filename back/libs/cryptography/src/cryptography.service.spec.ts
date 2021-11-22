import * as crypto from 'crypto';

import { Test, TestingModule } from '@nestjs/testing';

import {
  CryptographyService,
  RANDOM_MIN_ENTROPY,
} from './cryptography.service';
import { LowEntropyArgumentException } from './exceptions';

describe('CryptographyService', () => {
  let service: CryptographyService;

  const mockEncryptKey = 'p@ss p@rt0ut';
  const mockData = {
    // openid connect claim is not camelcase
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'Chuck',
    // openid connect claim is not camelcase
    // eslint-disable-next-line @typescript-eslint/naming-convention
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

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptographyService],
    }).compile();

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
      // action
      service.encryptSymetric(mockEncryptKey, mockDataToEncrypt);

      // expect
      expect(service['encrypt']).toHaveBeenCalledTimes(1);
      expect(service['encrypt']).toHaveBeenCalledWith(
        mockEncryptKey,
        mockDataToEncrypt,
      );
    });

    it('should return a base64 encoded string containing "nonce", "authTag" and "ciphertext" in this order', () => {
      // setup
      const finalCipher = Buffer.concat([
        mockRandomBytes12,
        mockAuthTag16,
        mockCiphertext,
      ]).toString('base64');

      // action
      const result = service.encryptSymetric(mockEncryptKey, mockDataToEncrypt);

      // expect
      expect(result).toEqual(finalCipher);
    });
  });

  describe('decryptSymetric', () => {
    it('should decrypt the given ciphertext calling "this.decrypt" and deserialize it', () => {
      // setup
      service['decrypt'] = jest.fn().mockReturnValueOnce(mockDataToEncrypt);

      // action
      const result = service.decryptSymetric(
        mockEncryptKey,
        mockCipher.toString('base64'),
      );

      // expect
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

      // action
      service.hash(data, inputEncoding, alg, outputDigest);

      // expect
      expect(mockCrypto.createHash).toHaveBeenCalledTimes(1);
      expect(mockCrypto.createHash).toHaveBeenCalledWith('sha256');
    });

    it('should create a Hash instance with sha256 if no algorythm is given', () => {
      // Given
      const data = 'someStringToHashBuddyIfYouMay/IMeanObeyNow/FasterForest';
      const inputEncoding = 'utf8';
      const alg = undefined;
      const outputDigest = 'hex';

      // action
      service.hash(data, inputEncoding, alg, outputDigest);

      // expect
      expect(mockCrypto.createHash).toHaveBeenCalledTimes(1);
      expect(mockCrypto.createHash).toHaveBeenCalledWith('sha256');
    });

    it('should call hash instance update with data and given input encoding', () => {
      // Given
      const data = 'someStringToHashBuddyIfYouMay/IMeanObeyNow/FasterForest';
      const inputEncoding = 'binary';
      const alg = 'sha256';
      const outputDigest = 'hex';

      // action
      service.hash(data, inputEncoding, alg, outputDigest);

      // expect
      expect(mockHash.update).toHaveBeenCalledTimes(1);
      expect(mockHash.update).toHaveBeenCalledWith(data, 'binary');
    });

    it('should call hash instance update with data and default input encoding', () => {
      // Given
      const data = 'someStringToHashBuddyIfYouMay/IMeanObeyNow/FasterForest';
      const inputEncoding = undefined;
      const alg = 'sha256';
      const outputDigest = 'hex';

      // action
      service.hash(data, inputEncoding, alg, outputDigest);

      // expect
      expect(mockHash.update).toHaveBeenCalledTimes(1);
      expect(mockHash.update).toHaveBeenCalledWith(data, 'utf8');
    });

    it('should digest the hash to given format', () => {
      // Given
      const data = 'someStringToHashBuddyIfYouMay/IMeanObeyNow/FasterForest';
      const inputEncoding = 'utf8';
      const alg = 'sha256';
      const outputDigest = 'base64';

      // action
      service.hash(data, inputEncoding, alg, outputDigest);

      // expect
      expect(mockHash.digest).toHaveBeenCalledTimes(1);
      expect(mockHash.digest).toHaveBeenCalledWith('base64');
    });

    it('should digest the hash to hex format', () => {
      // Given
      const data = 'someStringToHashBuddyIfYouMay/IMeanObeyNow/FasterForest';
      const inputEncoding = 'utf8';
      const alg = 'sha256';
      const outputDigest = undefined;

      // action
      service.hash(data, inputEncoding, alg, outputDigest);

      // expect
      expect(mockHash.digest).toHaveBeenCalledTimes(1);
      expect(mockHash.digest).toHaveBeenCalledWith('hex');
    });

    it('should return the digested hash', () => {
      // Given
      const data = 'someStringToHashBuddyIfYouMay/IMeanObeyNow/FasterForest';
      const inputEncoding = 'utf8';
      const alg = 'sha256';
      const outputDigest = 'hex';

      // action
      const result = service.hash(data, inputEncoding, alg, outputDigest);

      // expect
      expect(result).toEqual(mockHashDigestedHash);
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
      // setup
      const randomBytesSize = 12;

      // action
      service['encrypt'](mockEncryptKey, mockDataToEncrypt);

      // expect
      expect(mockCrypto.randomBytes).toHaveBeenCalledTimes(1);
      expect(mockCrypto.randomBytes).toHaveBeenCalledWith(randomBytesSize);
    });

    it('should create a cipher instance with aes-256-gcm and 16 bytes authTag', () => {
      // action
      service['encrypt'](mockEncryptKey, mockDataToEncrypt);

      // expect
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
      // action
      service['encrypt'](mockEncryptKey, mockDataToEncrypt);

      // expect
      expect(mockCipherGcm.update).toHaveBeenCalledTimes(1);
      expect(mockCipherGcm.update).toHaveBeenCalledWith(
        mockDataToEncrypt,
        'utf8',
      );
      expect(mockCipherGcm.final).toHaveBeenCalledTimes(1);
    });

    it('should get the authTag from the cipher instance', () => {
      // action
      service['encrypt'](mockEncryptKey, mockDataToEncrypt);

      // expect
      expect(mockCipherGcm.getAuthTag).toHaveBeenCalledTimes(1);
    });

    it('should return a buffer containing "nonce", "authTag" and "ciphertext" in this order', () => {
      // action
      const result = service['encrypt'](mockEncryptKey, mockDataToEncrypt);

      // expect
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
      //setup
      const WRONG_CIPHER = Buffer.from('LOWER_THAN_28_BYTES_STRING', 'utf8');

      // action
      try {
        service['decrypt'](mockEncryptKey, WRONG_CIPHER);
      } catch (e) {
        // expect
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe('Authentication failed !');
      }

      // expect
      expect.hasAssertions();
    });

    it('should throw an error when given cipher length is equal to cipher head length', () => {
      //setup
      const WRONG_CIPHER = Buffer.from('------28_BYTES_STRING-------', 'utf8');

      // action
      try {
        service['decrypt'](mockEncryptKey, WRONG_CIPHER);
      } catch (e) {
        // expect
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe('Authentication failed !');
      }

      // expect
      expect.hasAssertions();
    });

    it('should create a decipher instance with aes-256-gcm and 16 bytes authTag', () => {
      // action
      service['decrypt'](mockEncryptKey, mockCipher);

      // expect
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
      // action
      service['decrypt'](mockEncryptKey, mockCipher);

      // expect
      expect(mockDecipherGcm.setAuthTag).toHaveBeenCalledTimes(1);
      expect(mockDecipherGcm.setAuthTag).toHaveBeenCalledWith(mockAuthTag16);
    });

    it('should decrypt the given ciphertext using the cipher instance', () => {
      // action
      const result = service['decrypt'](mockEncryptKey, mockCipher);

      // expect
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
      // setup
      mockDecipherGcm.final.mockImplementationOnce(() => {
        throw new Error('Christmas is cancelled !');
      });

      // action
      try {
        service['decrypt'](mockEncryptKey, mockCipher);
      } catch (e) {
        // expect
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe('Authentication failed !');
      }

      // expect
      expect.hasAssertions();
    });
  });
});
