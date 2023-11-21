import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger-legacy';

import { getLoggerMock } from '@mocks/logger-legacy';

import { CsmrTracksService } from '../services';
import { CsmrTracksController } from './csmr-tracks.controller';

describe('CsmrTracksController', () => {
  let controller: CsmrTracksController;

  const loggerMock = getLoggerMock();
  const tracksMock = {
    getTracksForIdentity: jest.fn(),
  };

  const tracksDataMock = Symbol('tracksDataMock');

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [CsmrTracksController],
      providers: [LoggerService, CsmrTracksService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(CsmrTracksService)
      .useValue(tracksMock)
      .compile();

    controller = app.get<CsmrTracksController>(CsmrTracksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should set logger context', () => {
    expect(loggerMock.setContext).toHaveBeenCalledTimes(1);
    expect(loggerMock.setContext).toHaveBeenCalledWith('CsmrTracksController');
  });

  describe('aggregateTracks()', () => {
    // Given
    const identityMock = Symbol('identityMock');
    const optionsMock = Symbol('optionsMock');
    const payloadMock = {
      identity: identityMock,
      options: optionsMock,
    };

    beforeEach(() => {
      tracksMock.getTracksForIdentity.mockReturnValueOnce(tracksDataMock);
    });

    it('should call getTracksForIdentity() with identity and options from payload', async () => {
      // When
      await controller.aggregateTracks(payloadMock);
      // Then
      expect(tracksMock.getTracksForIdentity).toHaveBeenCalledTimes(1);
      expect(tracksMock.getTracksForIdentity).toHaveBeenCalledWith(
        identityMock,
        optionsMock,
      );
    });

    it('should return result from trackService.getTracksForIdentity()', async () => {
      // When
      const result = await controller.aggregateTracks(payloadMock);
      // Then
      expect(result).toBe(tracksDataMock);
    });

    it("should return 'ERROR' if getTracksForIdentity() throw an error", async () => {
      const errorMock = new Error('errorMock');
      tracksMock.getTracksForIdentity
        .mockReset()
        .mockRejectedValueOnce(errorMock);
      // When
      const result = await controller.aggregateTracks(payloadMock);
      // Then
      expect(result).toBe('ERROR');
    });
  });
});
