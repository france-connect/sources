import { Test, TestingModule } from '@nestjs/testing';

import { IEvent } from '../interfaces';
import { TrackingService } from '../tracking.service';
import { TrackingHandler } from './tracking.handler';

describe('TrackingHandler', () => {
  let handler: TrackingHandler;

  class TrackingHandlerMock extends TrackingHandler {}

  const EventsMapMock = [
    {
      HELLO_WORLD: {
        step: 'moonwalk',
        category: 'EASTER_EGG',
        event: 'ALL_YOUR_BASES_ARE_ARE_BELONG_TO_US',
        route: `/foo/bar/hello/world`,
        intercept: false,
      },
    },
  ];

  const trackingMock = {
    log: jest.fn(),
    EventsMap: EventsMapMock,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TrackingHandler,
          useClass: TrackingHandlerMock,
        },
        TrackingService,
      ],
    })
      .overrideProvider(TrackingService)
      .useValue(trackingMock)
      .compile();

    handler = module.get<TrackingHandler>(TrackingHandler);

    jest.resetAllMocks();
  });

  describe('EventsMap', () => {
    it('should return the EventMap from the tracking service', () => {
      // action
      const result = handler['EventsMap'];

      // expect
      expect(result).toEqual(EventsMapMock);
    });
  });

  describe('log', () => {
    it('Should call TrackingService.log', () => {
      // Given
      const eventDefinition = Symbol('eventDef') as unknown as IEvent;
      const event = {
        req: {
          ip: 'ipMock',
          fc: { interactionId: 'interactionIdMock' },
        },
      };
      // When
      handler['log'](eventDefinition, event);
      // Then
      expect(trackingMock.log).toBeCalledTimes(1);
      expect(trackingMock.log).toHaveBeenCalledWith(eventDefinition, event);
    });
  });
});
