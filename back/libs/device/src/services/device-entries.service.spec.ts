import { createHmac, Hmac } from 'crypto';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { IOidcIdentity } from '@fc/oidc';

import { getConfigMock } from '@mocks/config';

import { DeviceEntriesService } from './device-entries.service';

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  createHmac: jest.fn(),
}));

describe('DeviceEntriesService', () => {
  let service: DeviceEntriesService;

  const configMock = getConfigMock();
  const configValueMock = {
    identityHmacDailyTtl: 60,
    identityHashSourceProperties: ['foo', 'bar'],
    maxIdentityNumber: 3,
    identityHmacSecret: ['identityHmacSecretValue'],
  };

  const deviceSalt = 'deviceSaltValue';

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceEntriesService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)

      .compile();

    service = module.get<DeviceEntriesService>(DeviceEntriesService);

    configMock.get.mockReturnValue(configValueMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generate', () => {
    // Given
    const identityHashMock = Symbol('identityHashMock');
    const identityMock = {
      foo: 'fooValue',
      bar: 'barValue',
    } as unknown as IOidcIdentity;
    const oldEntriesMock = [
      {
        h: 'hash1',
        d: 123,
      },
      {
        h: 'hash2',
        d: 456,
      },
    ];

    beforeEach(() => {
      service['findCorrectHash'] = jest.fn().mockReturnValue(identityHashMock);
    });

    it('should fetch ttl from config', () => {
      // When
      service.generate(identityMock, deviceSalt, oldEntriesMock);

      // Then
      expect(configMock.get).toHaveBeenCalledExactlyOnceWith('Device');
    });

    it('should call findCorrectHash() with identity, deviceSalt and oldEntries', () => {
      // When
      service.generate(identityMock, deviceSalt, oldEntriesMock);

      // Then
      expect(service['findCorrectHash']).toHaveBeenCalledWith(
        identityMock,
        deviceSalt,
        oldEntriesMock,
      );
    });

    it('should return DeviceUserEntry with hash and timestamp', () => {
      // When
      const result = service.generate(identityMock, deviceSalt, oldEntriesMock);

      // Then
      expect(result).toEqual({
        h: identityHashMock,
        d: expect.any(Number),
      });
    });
  });

  describe('filterValidEntries', () => {
    it('should remove expired entries', () => {
      // Given
      service['isNotExpired'] = jest
        .fn()
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      const entries = [
        {
          h: 'hash1',
          d: 123,
        },
        {
          h: 'hash2',
          d: 456,
        },
      ];

      // When
      const result = service.filterValidEntries(entries);

      // Then
      expect(result.length).toBe(1);
      expect(result).toEqual([entries[0]]);
    });
  });

  describe('push', () => {
    it('should fetch maxIdentityNumber from config', () => {
      // Given
      const entries = [];
      const entry = { h: 'hash', d: 123 };

      service['filterValidEntries'] = jest.fn().mockReturnValueOnce(entries);

      // When
      service.push(entries, entry);

      // Then
      expect(configMock.get).toHaveBeenCalledExactlyOnceWith('Device');
    });

    it('should add a new entry to entries', () => {
      // Given
      const entries = [
        {
          h: 'hash1',
          d: 123,
        },
        {
          h: 'hash2',
          d: 456,
        },
      ];

      const entry = {
        h: 'hash3',
        d: 789,
      };

      service['filterValidEntries'] = jest.fn().mockReturnValueOnce(entries);

      const expected = [...entries, entry];

      // When
      const result = service.push(entries, entry);

      // Then
      expect(result.length).toBe(3);
      expect(result).toEqual(expected);
    });

    it('should add a new entry with correct timestamp if user already exist', () => {
      // Given
      const entries = [
        {
          h: 'hash1',
          d: 123,
        },
        {
          h: 'hash2',
          d: 456,
        },
      ];

      const entry = {
        h: 'hash2',
        d: 789,
      };

      service['filterValidEntries'] = jest.fn().mockReturnValueOnce(entries);

      // When
      const result = service.push(entries, entry);

      // Then
      expect(result.length).toBe(2);
      expect(result).toEqual([entries[0], entry]);
    });

    it('should keep only the last maxIdentityNumber entries', () => {
      const entries = [
        {
          h: 'hash1',
          d: 123,
        },
        {
          h: 'hash2',
          d: 456,
        },
        {
          h: 'hash3',
          d: 789,
        },
      ];

      const entry = {
        h: 'hash4',
        d: 789,
      };

      service['filterValidEntries'] = jest.fn().mockReturnValueOnce(entries);

      // When
      const result = service.push(entries, entry);

      // Then
      expect(result.length).toBe(3);
      expect(result).toEqual([entries[1], entries[2], entry]);
    });
  });

  describe('isNotExpired', () => {
    it('should return true if trustExpirationDate is in the future', () => {
      // Given
      const trustExpirationDate = Date.now() + 1000;

      // When
      const result = service['isNotExpired']({ d: trustExpirationDate });

      // Then
      expect(result).toBe(true);
    });

    it('should return false if trustExpirationDate is in the past', () => {
      // Given
      const trustExpirationDate = Date.now() - 1000;

      // When
      const result = service['isNotExpired']({ d: trustExpirationDate });

      // Then
      expect(result).toBe(false);
    });
  });

  describe('hashIdentity', () => {
    // Given
    const hashMock = Symbol('hashMock');
    const createHmacMock = jest.mocked(createHmac);
    const updateMock = jest.fn().mockReturnThis();
    const digestMock = jest.fn().mockReturnValue(hashMock);
    const identity = {
      foo: 'fooValue',
      fizz: 'fizzValue',
      bar: 'barValue',
      baz: 'bazValue',
    };
    const secretMock = 'secrect';

    beforeEach(() => {
      createHmacMock.mockReturnValue({
        update: updateMock,
        digest: digestMock,
      } as unknown as Hmac);
    });

    it('should fetch identityHashSourceProperties from config', () => {
      // When
      service['hashIdentity'](
        identity as unknown as IOidcIdentity,
        secretMock,
        deviceSalt,
      );

      // Then
      expect(configMock.get).toHaveBeenCalledExactlyOnceWith('Device');
    });

    it('should call createHmac with sha256 and salt', () => {
      // When
      service['hashIdentity'](
        identity as unknown as IOidcIdentity,
        secretMock,
        deviceSalt,
      );

      // Then
      expect(createHmacMock).toHaveBeenCalledExactlyOnceWith(
        'sha256',
        `${deviceSalt}${secretMock}`,
      );
    });

    it('should call Hmac.update with concatenated values of properties picked from config', () => {
      // When
      service['hashIdentity'](
        identity as unknown as IOidcIdentity,
        secretMock,
        deviceSalt,
      );

      // Then
      expect(updateMock).toHaveBeenCalledExactlyOnceWith(
        `${identity.foo}${identity.bar}`,
      );
    });

    it('should call Hmac.digest with base64', () => {
      // When
      service['hashIdentity'](
        identity as unknown as IOidcIdentity,
        secretMock,
        deviceSalt,
      );

      // Then
      expect(digestMock).toHaveBeenCalledExactlyOnceWith('base64');
    });

    it('should return result of Hmac.digest', () => {
      // When
      const result = service['hashIdentity'](
        identity as unknown as IOidcIdentity,
        secretMock,
        deviceSalt,
      );

      // Then
      expect(result).toBe(hashMock);
    });
  });

  describe('findCorrectHash', () => {
    // Given
    const identityMock = {
      foo: 'fooValue',
      bar: 'barValue',
    } as unknown as IOidcIdentity;
    const deviceSalt = 'deviceSalt';
    const oldEntries = [
      {
        h: 'hash1',
        d: 123,
      },
      {
        h: 'hash2',
        d: 456,
      },
    ];

    const secretListMock = ['secret1', 'secret2', 'secret3'];

    beforeEach(() => {
      service['hashIdentity'] = jest
        .fn()
        .mockReturnValue('hash:Others')
        .mockReturnValueOnce('hash:First');
      service['isHashInEntries'] = jest.fn().mockReturnValue(false);

      configMock.get.mockReturnValue({
        identityHmacSecret: secretListMock,
      });
    });

    it('should return first hash if no hash is found in entries', () => {
      // When
      const result = service['findCorrectHash'](
        identityMock,
        deviceSalt,
        oldEntries,
      );

      // Then
      expect(result).toBe('hash:First');
    });

    it('should call hash for each secrets if no hash is found in entries ', () => {
      // When
      service['findCorrectHash'](identityMock, deviceSalt, oldEntries);

      // Then
      expect(service['hashIdentity']).toHaveBeenCalledTimes(3);
      expect(service['hashIdentity']).toHaveBeenNthCalledWith(
        1,
        identityMock,
        secretListMock[0],
        deviceSalt,
      );
      expect(service['hashIdentity']).toHaveBeenNthCalledWith(
        2,
        identityMock,
        secretListMock[1],
        deviceSalt,
      );
      expect(service['hashIdentity']).toHaveBeenNthCalledWith(
        3,
        identityMock,
        secretListMock[2],
        deviceSalt,
      );
    });

    it('should return first hash if it is in entries', () => {
      // Given
      service['isHashInEntries'] = jest.fn().mockReturnValueOnce(true);

      // When
      const result = service['findCorrectHash'](
        identityMock,
        deviceSalt,
        oldEntries,
      );

      // Then
      expect(result).toBe('hash:First');
    });

    it('should call hashIdentity only once if first hash is in entries', () => {
      // Given
      service['isHashInEntries'] = jest.fn().mockReturnValueOnce(true);

      // When
      service['findCorrectHash'](identityMock, deviceSalt, oldEntries);

      // Then
      expect(service['hashIdentity']).toHaveBeenCalledTimes(1);
    });

    it('should return second hash if it is in entries', () => {
      // Given
      service['hashIdentity'] = jest.fn().mockReturnValueOnce('hash2');

      // When
      const result = service['findCorrectHash'](
        identityMock,
        deviceSalt,
        oldEntries,
      );

      // Then
      expect(result).toBe('hash2');
    });
  });

  describe('isHashInEntries', () => {
    it('should return true if hash is in entries', () => {
      // Given
      const entries = [
        {
          h: 'hash1',
          d: 123,
        },
        {
          h: 'hash2',
          d: 456,
        },
      ];

      // When
      const result = service['isHashInEntries'](entries, 'hash2');

      // Then
      expect(result).toBe(true);
    });

    it('should return false if hash is not in entries', () => {
      // Given
      const entries = [
        {
          h: 'hash1',
          d: 123,
        },
        {
          h: 'hash2',
          d: 456,
        },
      ];

      // When
      const result = service['isHashInEntries'](entries, 'hash3');

      // Then
      expect(result).toBe(false);
    });
  });
});
