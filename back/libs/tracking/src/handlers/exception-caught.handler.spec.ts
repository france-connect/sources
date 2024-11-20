import { Test, TestingModule } from '@nestjs/testing';

import { TrackingService } from '../services';
import { ExceptionCaughtHandler } from './exception-caught.handler';

describe('ExceptionCaughtHandler', () => {
  let handler: ExceptionCaughtHandler;

  const trackingServiceMock = {
    trackExceptionIfNeeded: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ExceptionCaughtHandler, TrackingService],
    })
      .overrideProvider(TrackingService)
      .useValue(trackingServiceMock)
      .compile();

    handler = module.get<ExceptionCaughtHandler>(ExceptionCaughtHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('handle', () => {
    it('should track exception if needed', async () => {
      const event = {
        exception: new Error('error'),
        context: {},
      };

      await handler.handle(event);

      expect(trackingServiceMock.trackExceptionIfNeeded).toHaveBeenCalledWith(
        event.exception,
        event.context,
      );
    });
  });
});
