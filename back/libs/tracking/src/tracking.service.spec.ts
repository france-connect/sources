import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { APP_TRACKING_SERVICE } from './app-tracking-service.token';
import { IEvent, IEventContext } from './interfaces';
import { TrackingService } from './tracking.service';

describe('TrackingService', () => {
  let service: TrackingService;

  const appTrackingMock = {
    buildLog: jest.fn(),
  };

  const eventBusMock = {
    publish: jest.fn(),
  };

  const loggerMock = {
    setContext: jest.fn(),
    businessEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackingService,
        EventBus,
        LoggerService,
        {
          provide: APP_TRACKING_SERVICE,
          useValue: appTrackingMock,
        },
      ],
    })
      .overrideProvider(EventBus)
      .useValue(eventBusMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<TrackingService>(TrackingService);

    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get EventsMap', () => {
    it('Should return EventsMap property from appTrackingService', () => {
      // Given
      const eventsMapMock = Symbol('eventsMapMock');
      appTrackingMock['EventsMap'] = eventsMapMock;
      // When
      const result = service.EventsMap;
      // Then
      expect(result).toBe(eventsMapMock);
    });
  });

  describe('track', () => {
    it('should instanciate passed class with passed context', () => {
      // Given
      const constructorSpy = jest.fn();
      class EventClassMock {
        constructor(...arg) {
          constructorSpy(...arg);
        }
      }
      const context = Symbol('context') as unknown as IEventContext;
      // When
      service.track(EventClassMock, context);
      // Then
      expect(constructorSpy).toHaveBeenCalledTimes(1);
      expect(constructorSpy).toHaveBeenCalledWith(context);
    });
    it('should call eventBus.publish with instanciated object', () => {
      // Given
      const constructorSpy = jest.fn();
      class EventClassMock {
        constructor(arg) {
          constructorSpy(arg);
        }
      }
      const context = Symbol('context') as unknown as IEventContext;
      // When
      service.track(EventClassMock, context);
      // Then
      expect(eventBusMock.publish).toHaveBeenCalledTimes(1);
      expect(eventBusMock.publish).toHaveBeenCalledWith(
        expect.any(EventClassMock),
      );
    });
  });

  describe('log', () => {
    it('should call injected appTrackingService.buildLog method', async () => {
      // Given
      const eventMock = Symbol('eventMock') as unknown as IEvent;
      const contextMock = Symbol('contextMock') as unknown as IEventContext;
      // When
      await service.log(eventMock, contextMock);
      // Then
      expect(appTrackingMock.buildLog).toHaveBeenCalledTimes(1);
      expect(appTrackingMock.buildLog).toHaveBeenCalledWith(
        eventMock,
        contextMock,
      );
    });
    it('should call logger.businessEvent method with result from appTrackingService.buildLog method', async () => {
      // Given
      const eventMock = Symbol('eventMock') as unknown as IEvent;
      const contextMock = Symbol('contextMock') as unknown as IEventContext;
      const messageMock = Symbol('messageMock');
      appTrackingMock.buildLog.mockResolvedValueOnce(messageMock);
      // When
      await service.log(eventMock, contextMock);
      // Then
      expect(loggerMock.businessEvent).toHaveBeenCalledTimes(1);
      expect(loggerMock.businessEvent).toHaveBeenCalledWith(messageMock);
    });
  });
});
