import { Test, TestingModule } from '@nestjs/testing';

import { IOidcIdentity } from '@fc/oidc';
import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { DeviceService } from './device.service';
import { DeviceCookieService } from './device-cookie.service';
import { DeviceEntriesService } from './device-entries.service';
import { DeviceHeaderFlagsService } from './device-header-flags.service';
import { DeviceInformationService } from './device-information.service';

describe('DeviceService', () => {
  let service: DeviceService;

  const sessionMock = getSessionServiceMock();
  const sessionData = {
    isSuspicious: Symbol('suspicious'),
  };

  const cookieMock = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const entriesMock = {
    filterValidEntries: jest.fn(),
    generate: jest.fn(),
    push: jest.fn(),
  };

  const infosMock = {
    extract: jest.fn(),
    isTrusted: jest.fn(),
  };

  const headerFlagsMock = {
    isSuspicious: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceService,
        SessionService,
        DeviceCookieService,
        DeviceEntriesService,
        DeviceHeaderFlagsService,
        DeviceInformationService,
      ],
    })
      .overrideProvider(SessionService)
      .useValue(sessionMock)
      .overrideProvider(DeviceCookieService)
      .useValue(cookieMock)
      .overrideProvider(DeviceEntriesService)
      .useValue(entriesMock)
      .overrideProvider(DeviceInformationService)
      .useValue(infosMock)
      .overrideProvider(DeviceHeaderFlagsService)
      .useValue(headerFlagsMock)
      .compile();

    service = module.get<DeviceService>(DeviceService);

    sessionMock.get.mockReturnValue(sessionData);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    const req = { headers: {} } as any;
    const res = {} as any;
    const identity = { foo: 'bar' } as Partial<Omit<IOidcIdentity, 'sub'>>;

    const isTrusted = true;
    const accountCount = 1;

    const deviceSalt = 'salt';
    const oldEntries = [];
    const newEntries = [];
    const entry = { h: 'hash', d: 123 };
    const report = {
      accountCount,
      isSuspicious: sessionData.isSuspicious,
      isTrusted,
    };

    beforeEach(() => {
      service['getDeviceCookie'] = jest
        .fn()
        .mockResolvedValue({ s: deviceSalt, e: oldEntries });
      entriesMock.generate.mockReturnValue(entry);
      entriesMock.push.mockReturnValue(newEntries);
      infosMock.extract.mockReturnValue(report);
    });

    it('should fetch device cookie', async () => {
      // When
      await service.update(req, res, identity);

      // Then
      expect(service['getDeviceCookie']).toHaveBeenCalledWith(req);
    });

    it('should generate new entry', async () => {
      // When
      await service.update(req, res, identity);

      // Then
      expect(entriesMock.generate).toHaveBeenCalledWith(
        identity,
        deviceSalt,
        oldEntries,
      );
    });

    it('should push new entry', async () => {
      // When
      await service.update(req, res, identity);

      // Then
      expect(entriesMock.push).toHaveBeenCalledWith(oldEntries, entry);
    });

    it('should extract informations', async () => {
      // When
      await service.update(req, res, identity);

      // Then
      expect(infosMock.extract).toHaveBeenCalledWith(
        entry,
        oldEntries,
        newEntries,
      );
    });

    it('should update session', async () => {
      // When
      await service.update(req, res, identity);

      // Then
      expect(sessionMock.set).toHaveBeenCalledWith('Device', {
        accountCount,
        isSuspicious: sessionData.isSuspicious,
        isTrusted,
      });
    });

    it('should update cookie', async () => {
      // When
      await service.update(req, res, identity);

      // Then
      expect(cookieMock.set).toHaveBeenCalledWith(res, {
        s: deviceSalt,
        e: newEntries,
      });
    });

    it('should return report', async () => {
      // When
      const result = await service.update(req, res, identity);

      // Then
      expect(result).toBe(report);
    });
  });

  describe('initSession', () => {
    const req = { headers: {} } as any;

    const deviceCookie = {
      s: 'salt',
      e: [{}, {}],
    };

    const isTrusted = true;

    beforeEach(() => {
      service['getDeviceCookie'] = jest.fn().mockResolvedValue(deviceCookie);
      infosMock.isTrusted.mockReturnValue(isTrusted);
      headerFlagsMock.isSuspicious.mockReturnValue(sessionData.isSuspicious);
    });

    it('should check if device is suspicious', async () => {
      // When
      await service.initSession(req);

      // Then
      expect(headerFlagsMock.isSuspicious).toHaveBeenCalledWith(req);
    });

    it('should fetch device cookie', async () => {
      // When
      await service.initSession(req);

      // Then
      expect(service['getDeviceCookie']).toHaveBeenCalledWith(req);
    });

    it('should check if device is trusted', async () => {
      // When
      await service.initSession(req);

      // Then
      expect(infosMock.isTrusted).toHaveBeenCalledWith(deviceCookie.e);
    });

    it('should set session', async () => {
      // When
      await service.initSession(req);

      // Then
      expect(sessionMock.set).toHaveBeenCalledWith('Device', {
        accountCount: deviceCookie.e.length,
        isSuspicious: sessionData.isSuspicious,
        isTrusted,
      });
    });
  });

  describe('getDeviceCookie', () => {
    const req = { headers: {} } as any;
    const deviceCookie = {
      s: 'salt',
      e: [{}, {}],
    };
    const filteredDeviceCookie = {
      s: 'salt',
      e: [{}],
    };

    it('should return device cookie with valid entries', async () => {
      // Given
      cookieMock.get.mockResolvedValue(deviceCookie);
      entriesMock.filterValidEntries.mockReturnValue(filteredDeviceCookie.e);

      // When
      const result = await service['getDeviceCookie'](req);

      // Then
      expect(cookieMock.get).toHaveBeenCalledWith(req);
      expect(entriesMock.filterValidEntries).toHaveBeenCalledWith(
        deviceCookie.e,
      );
      expect(result).toEqual(filteredDeviceCookie);
    });
  });
});
