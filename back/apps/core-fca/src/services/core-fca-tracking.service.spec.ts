import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CoreTrackingService } from '@fc/core';
import { TrackedEventMapType } from '@fc/tracking';

import { CoreFcaTrackingService } from './core-fca-tracking.service';

describe('CoreFcaTrackingService', () => {
  let service: CoreFcaTrackingService;

  const getEventsMapReturnMock = Symbol(
    'getEventsMapReturnMock',
  ) as unknown as TrackedEventMapType;

  const appConfigMock = {
    urlPrefix: '/api/v2',
  };

  const configServiceMock = {
    get: () => appConfigMock,
  };

  const coreTrackingServiceMock = {
    buildLog: jest.fn(),
    EventsMap: getEventsMapReturnMock,
  };

  const buildLogMockedResponse = Symbol('buildLogMockedResponse');

  const eventMock = {
    step: '1',
    category: 'some category',
    event: 'name',
    route: '/',
    exceptions: [],
    intercept: false,
  };

  const ipMock = '123.123.123.123';
  const sourcePortMock = '443';
  const xForwardedForOriginalMock = '123.123.123.123, 124.124.124.124';
  const interactionIdMock = 'interactionIdValue';

  const contextMock = {
    req: {
      headers: {
        'x-forwarded-for': ipMock,
        'x-forwarded-source-port': sourcePortMock,
        'x-forwarded-for-original': xForwardedForOriginalMock,
      },
      fc: {
        interactionId: interactionIdMock,
      },
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreFcaTrackingService, ConfigService, CoreTrackingService],
    })
      .overrideProvider(CoreTrackingService)
      .useValue(coreTrackingServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<CoreFcaTrackingService>(CoreFcaTrackingService);
    coreTrackingServiceMock.buildLog.mockResolvedValue(buildLogMockedResponse);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buildLog()', () => {
    it('should call coreTrackingService.buildLog()', async () => {
      // When
      await service.buildLog(eventMock, contextMock);
      // Then
      expect(coreTrackingServiceMock.buildLog).toHaveBeenCalledTimes(1);
      expect(coreTrackingServiceMock.buildLog).toHaveBeenCalledWith(
        eventMock,
        contextMock,
      );
    });

    it('should return result of call to coreTrackingService.buildLog()', async () => {
      // When
      const result = await service.buildLog(eventMock, contextMock);
      // Then
      expect(result).toBe(buildLogMockedResponse);
    });
  });
});
