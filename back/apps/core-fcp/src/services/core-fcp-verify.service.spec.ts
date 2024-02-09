import { Request } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CoreVerifyService } from '@fc/core';

import { getSessionServiceMock } from '@mocks/session';

import { CoreFcpVerifyService } from './core-fcp-verify.service';

describe('CoreFcpVerifyService', () => {
  let service: CoreFcpVerifyService;

  const configServiceMock = {
    get: jest.fn(),
  };

  const coreVerifyServiceMock = {
    verify: jest.fn(),
    trackVerified: jest.fn(),
  };

  const sessionServiceMock = getSessionServiceMock();

  const interactionIdMock = 'interactionIdMockValue';

  const req = {
    fc: {
      interactionId: interactionIdMock,
    },
    query: {
      firstQueryParam: 'first',
      secondQueryParam: 'second',
    },
  } as unknown as Request;

  const params = {
    urlPrefix: 'urlPrefixValue',
    interactionId: 'interactionId',
    sessionOidc: sessionServiceMock,
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      providers: [CoreFcpVerifyService, ConfigService, CoreVerifyService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(CoreVerifyService)
      .useValue(coreVerifyServiceMock)
      .compile();

    service = await app.get<CoreFcpVerifyService>(CoreFcpVerifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleVerify()', () => {
    beforeEach(() => {
      service['trackVerified'] = jest.fn();
    });

    it('should call core.verify()', async () => {
      // When
      await service['handleVerifyIdentity'](req, params);
      // Then
      expect(coreVerifyServiceMock.verify).toHaveBeenCalledTimes(1);
      expect(coreVerifyServiceMock.verify).toHaveBeenCalledWith(
        sessionServiceMock,
        { req },
      );
    });

    it('should call trackVerified()', async () => {
      // When
      await service['handleVerifyIdentity'](req, params);
      // Then
      expect(coreVerifyServiceMock.trackVerified).toHaveBeenCalledTimes(1);
      expect(coreVerifyServiceMock.trackVerified).toHaveBeenCalledWith(req);
    });

    it('should return url result', async () => {
      // Given
      const expected = 'urlPrefixValue/interaction/interactionId/consent';
      // When
      const result = await service['handleVerifyIdentity'](req, params);
      // Then
      expect(result).toBe(expected);
    });
  });

  describe('handleInsufficientAcrLevel()', () => {
    beforeEach(() => {
      configServiceMock.get = jest.fn().mockReturnValue({
        urlPrefix: 'urlPrefixValue',
      });
    });

    it('should get urlPrefix from config', () => {
      // When
      service['handleInsufficientAcrLevel'](interactionIdMock);
      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('App');
    });

    it('should return url result', () => {
      // Given
      const expected = 'urlPrefixValue/interaction/interactionIdMockValue';
      // When
      const result = service['handleInsufficientAcrLevel'](interactionIdMock);
      // Then
      expect(result).toBe(expected);
    });
  });
});
