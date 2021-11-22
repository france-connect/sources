import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { CsmrTracksService } from '../services/csmr-tracks.service';
import { CsmrTracksController } from './csmr-tracks.controller';

describe('CsmrTracksController', () => {
  let controller: CsmrTracksController;

  const loggerMock = {
    debug: jest.fn(),
    trace: jest.fn(),
    setContext: jest.fn(),
  };

  const csmrTracksMock = {
    getList: jest.fn(),
  };

  const payloadMock = {
    pattern: 'SOME_PATTERN',
    data: {},
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CsmrTracksController],
      providers: [LoggerService, CsmrTracksService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(CsmrTracksService)
      .useValue(csmrTracksMock)
      .compile();

    controller = app.get<CsmrTracksController>(CsmrTracksController);
  });

  describe('getTracks()', () => {
    it('Should return result of CsmrTracksService.getList()', async () => {
      // Given
      const expected = 'some string';
      csmrTracksMock.getList.mockResolvedValueOnce(expected);
      // When
      const result = await controller.getTracks(payloadMock);
      // Then
      expect(result).toEqual(expected);
    });

    it('Should return an empty array if an error is throwed by csmrTracks.getList()', async () => {
      // Given
      csmrTracksMock.getList.mockImplementationOnce(() => {
        throw new Error();
      });
      // When
      const result = await controller.getTracks(payloadMock);
      // Then
      expect(result).toEqual([]);
    });
  });
});
