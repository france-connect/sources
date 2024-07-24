import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { SessionService } from '@fc/session';

import { getConfigMock } from '@mocks/config';
import { getSessionServiceMock } from '@mocks/session';

import { DeviceUserEntry } from '../dto';
import { DeviceInformationService } from './device-information.service';

describe('DeviceInformationService', () => {
  let service: DeviceInformationService;

  const configMock = getConfigMock();
  const configValueMock = {
    maxIdentityNumber: 1,
    maxIdentityTrusted: 2,
    identityHmacDailyTtl: 3,
  };

  const sessionMock = getSessionServiceMock();
  const sessionData = {
    isSuspicious: Symbol('isSuspicious'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceInformationService, ConfigService, SessionService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(SessionService)
      .useValue(sessionMock)
      .compile();

    service = module.get<DeviceInformationService>(DeviceInformationService);

    configMock.get.mockReturnValue(configValueMock);
    sessionMock.get.mockReturnValue(sessionData);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('extract', () => {
    const isSharedResult = Symbol('isShared');
    const isTrustedResult = Symbol('isTrusted');
    const isKnowDeviceResult = Symbol('isKnowDevice');
    const isNewIdentityResult = Symbol('isNewIdentity');
    const sharedBecameTrustedResult = Symbol('sharedBecameTrusted');
    const becameTrustedResult = Symbol('becameTrusted');
    const becameSharedResult = Symbol('becameShared');

    const userEntry = { h: 'hash', d: 123 };
    const oldEntries = [];
    const newEntries = [];

    beforeEach(() => {
      service['isShared'] = jest.fn().mockReturnValue(isSharedResult);
      service['isTrusted'] = jest.fn().mockReturnValue(isTrustedResult);
      service['isKnowDevice'] = jest.fn().mockReturnValue(isKnowDeviceResult);
      service['isNewIdentity'] = jest.fn().mockReturnValue(isNewIdentityResult);
      service['sharedBecameTrusted'] = jest
        .fn()
        .mockReturnValue(sharedBecameTrustedResult);
      service['becameTrusted'] = jest.fn().mockReturnValue(becameTrustedResult);
      service['becameShared'] = jest.fn().mockReturnValue(becameSharedResult);
    });

    it('should fetch configuration', () => {
      // When
      service.extract(userEntry, oldEntries, newEntries);

      // Then
      expect(configMock.get).toHaveBeenCalledExactlyOnceWith('Device');
    });

    it('should return DeviceInformationInterface', () => {
      // When
      const result = service.extract(userEntry, oldEntries, newEntries);

      // Then
      expect(result).toEqual({
        isTrusted: isTrustedResult,
        shared: isSharedResult,
        isSuspicious: sessionData.isSuspicious,

        maxIdentityNumber: configValueMock.maxIdentityNumber,
        maxIdentityTrusted: configValueMock.maxIdentityTrusted,
        identityHmacDailyTtl: configValueMock.identityHmacDailyTtl,

        accountCount: newEntries.length,
        knownDevice: isKnowDeviceResult,
        newIdentity: isNewIdentityResult,
        becameTrusted: becameTrustedResult,
        becameShared: becameSharedResult,
      });
    });
  });

  describe('isShared', () => {
    it('should return true when entries length is greater than maxIdentityTrusted', () => {
      // Given
      const entries = [{}, {}, {}] as DeviceUserEntry[];

      // When
      const result = service['isShared'](entries);

      // Then
      expect(result).toBe(true);
    });

    it('should return false when entries length is less than or equal to maxIdentityTrusted', () => {
      // Given
      const entries = [{}, {}] as DeviceUserEntry[];

      // When
      const result = service['isShared'](entries);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('isTrusted', () => {
    it('should return true when entries length is greater than 0 and less than or equal to maxIdentityTrusted', () => {
      // Given
      const entries = [{}, {}] as DeviceUserEntry[];

      // When
      const result = service['isTrusted'](entries);

      // Then
      expect(result).toBe(true);
    });

    it('should return false when entries length is 0', () => {
      // Given
      const entries = [] as DeviceUserEntry[];

      // When
      const result = service['isTrusted'](entries);

      // Then
      expect(result).toBe(false);
    });

    it('should return false when entries length is greater than maxIdentityTrusted', () => {
      // Given
      const entries = [{}, {}, {}] as DeviceUserEntry[];

      // When
      const result = service['isTrusted'](entries);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('isKnowDevice', () => {
    it('should return true when entries length is greater than 0', () => {
      // Given
      const entries = [{}, {}] as DeviceUserEntry[];

      // When
      const result = service['isKnowDevice'](entries);

      // Then
      expect(result).toBe(true);
    });

    it('should return false when entries length is 0', () => {
      // Given
      const entries = [] as DeviceUserEntry[];

      // When
      const result = service['isKnowDevice'](entries);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('isNewIdentity', () => {
    it('should return true when userEntry is not in oldEntries', () => {
      // Given
      const userEntry = { h: 'hash' } as DeviceUserEntry;
      const oldEntries = [{ h: 'anotherHash' }] as DeviceUserEntry[];

      // When
      const result = service['isNewIdentity'](oldEntries, userEntry);

      // Then
      expect(result).toBe(true);
    });

    it('should return false when userEntry is in oldEntries', () => {
      // Given
      const userEntry = { h: 'hash' } as DeviceUserEntry;
      const oldEntries = [{ h: 'hash' }] as DeviceUserEntry[];

      // When
      const result = service['isNewIdentity'](oldEntries, userEntry);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('sharedBecameTrusted', () => {
    it('should return true when oldEntries length is greater than maxIdentityTrusted and accountCount is less than oldEntries length and less than or equal to maxIdentityTrusted', () => {
      // Given
      const accountCount = 1;
      const oldEntries = [{}, {}, {}] as DeviceUserEntry[];
      const maxIdentityTrusted = 2;

      // When
      const result = service['sharedBecameTrusted'](
        accountCount,
        oldEntries,
        maxIdentityTrusted,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should return false when oldEntries length is not greater than maxIdentityTrusted or accountCount is greater than oldEntries length or greater than maxIdentityTrusted', () => {
      // Given
      const accountCount = 3;
      const oldEntries = [{}, {}] as DeviceUserEntry[];
      const maxIdentityTrusted = 2;

      // When
      const result = service['sharedBecameTrusted'](
        accountCount,
        oldEntries,
        maxIdentityTrusted,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return false when oldEntries length is greater than maxIdentityTrusted and accountCount is greater than maxIdentityTrusted', () => {
      // Given
      const accountCount = 4;
      const oldEntries = [{}, {}, {}, {}, {}] as DeviceUserEntry[];
      const maxIdentityTrusted = 2;

      // When
      const result = service['sharedBecameTrusted'](
        accountCount,
        oldEntries,
        maxIdentityTrusted,
      );

      // Then
      expect(result).toBe(false);
    });
  });

  describe('becameTrusted', () => {
    it('should return true when knownDevice is false or sharedBecameTrusted is true', () => {
      // Given
      const knownDevice = false;
      const sharedBecameTrusted = true;

      // When
      const result = service['becameTrusted'](knownDevice, sharedBecameTrusted);

      // Then
      expect(result).toBe(true);
    });

    it('should return false when knownDevice is true and sharedBecameTrusted is false', () => {
      // Given
      const knownDevice = true;
      const sharedBecameTrusted = false;

      // When
      const result = service['becameTrusted'](knownDevice, sharedBecameTrusted);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('becameShared', () => {
    it('should return true when oldEntries length is equal to maxIdentityTrusted and newEntries length is greater than maxIdentityTrusted', () => {
      // Given
      const oldEntries = [{}, {}] as DeviceUserEntry[];
      const newEntries = [{}, {}, {}] as DeviceUserEntry[];
      const maxIdentityTrusted = 2;

      // When
      const result = service['becameShared'](
        oldEntries,
        newEntries,
        maxIdentityTrusted,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should return false when oldEntries length is not equal to maxIdentityTrusted or newEntries length is not greater than maxIdentityTrusted', () => {
      // Given
      const oldEntries = [{}, {}] as DeviceUserEntry[];
      const newEntries = [{}, {}] as DeviceUserEntry[];
      const maxIdentityTrusted = 2;

      // When
      const result = service['becameShared'](
        oldEntries,
        newEntries,
        maxIdentityTrusted,
      );

      // Then
      expect(result).toBe(false);
    });
  });
});
