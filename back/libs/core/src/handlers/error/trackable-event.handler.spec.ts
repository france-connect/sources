import { TrackingService } from '@fc/tracking';

import { TrackableEventHandler } from './trackable-event.handler';

describe('TrackableEventHandler', () => {
  /**
   * @TODO #254
   * ETQ Dev, je regarde pourquoi on ne peut pas tester des vrais class dans JEST
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/254
   */
  const trackingServiceMock = {
    EventsMap: {
      FC_RECEIVED_DECEASED_RNIPP: {
        event: 'FC_RECEIVED_DECEASED_RNIPP',
        exceptions: ['RnippDeceasedException'],
      },
      FC_RECEIVED_INVALID_RNIPP: {
        event: 'FC_RECEIVED_INVALID_RNIPP',
        exceptions: [
          'RnippNotFoundMultipleEchoException',
          'RnippNotFoundNoEchoException',
          'RnippNotFoundSingleEchoException',
          'RnippFoundOnlyWithMaritalNameException',
        ],
      },
    },
    log: jest.fn(),
  } as unknown as TrackingService;

  const handler: TrackableEventHandler = new TrackableEventHandler(
    trackingServiceMock,
  );
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('handle', () => {
    it('should call log function if exception found in event map', () => {
      // Given
      const eventMock = {
        context: {
          exception: {
            constructor: 'RnippDeceasedException',
          },
        },
      };
      jest.spyOn(trackingServiceMock, 'log');
      // When
      handler.handle(eventMock);
      // Then
      expect(trackingServiceMock.log).toHaveBeenCalledTimes(1);
    });

    it('should not call log function if no exception found in event map', () => {
      // Given
      const eventMock = {
        context: {
          exception: {
            constructor: 'exceptionNotFound',
          },
        },
      };
      jest.spyOn(trackingServiceMock, 'log');
      // When
      handler.handle(eventMock);
      // Then
      expect(trackingServiceMock.log).toHaveBeenCalledTimes(0);
    });
  });

  describe('getEventFromMap', () => {
    it('should return event map if rnipp throws "desceased" exception', () => {
      // Given
      const RnippDeceasedExceptionMock = {
        exception: {
          constructor: 'RnippDeceasedException',
        },
      };
      // When
      const result = handler['getEventFromMap'](RnippDeceasedExceptionMock);
      // Then
      expect(result).toMatchObject({
        event: 'FC_RECEIVED_DECEASED_RNIPP',
        exceptions: ['RnippDeceasedException'],
      });
    });

    it('should return event map if rnipp throws "not found multiple echo" exception', () => {
      // Given
      const RnippNotFoundMultipleEchoExceptionMock = {
        exception: {
          constructor: 'RnippNotFoundMultipleEchoException',
        },
      };
      // When
      const result = handler['getEventFromMap'](
        RnippNotFoundMultipleEchoExceptionMock,
      );
      // Then
      expect(result).toMatchObject({
        event: 'FC_RECEIVED_INVALID_RNIPP',
        exceptions: [
          'RnippNotFoundMultipleEchoException',
          'RnippNotFoundNoEchoException',
          'RnippNotFoundSingleEchoException',
          'RnippFoundOnlyWithMaritalNameException',
        ],
      });
    });

    it('should return undefined if no context is set', () => {
      // When
      const result = handler['getEventFromMap']();
      // Then
      expect(result).toBeUndefined;
    });

    it('should return undefined if there are no class defined (undefined exceptions)', () => {
      // Given
      const ExceptionMock = {};
      // When
      const result = handler['getEventFromMap'](ExceptionMock);
      // Then
      expect(result).toBeUndefined;
    });

    it('should return undefined if there are no class defined (undefined constructor)', () => {
      // Given
      const ExceptionMock = { exceptions: {} };
      // When
      const result = handler['getEventFromMap'](ExceptionMock);
      // Then
      expect(result).toBeUndefined;
    });
  });
});
