import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger-legacy';

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

  const identityHashMock = Symbol('identityHash') as unknown as string;
  const payloadMock = {
    identityHash: identityHashMock,
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

    /**
     * @todo #825 implement Error protocol
     *
     * Author: Arnaud PSA
     * Date: 22/02/2022
     */
    it('Should return an ERROR message if an error is throwed by csmrTracks.getList()', async () => {
      // Given
      csmrTracksMock.getList.mockImplementationOnce(() => {
        throw new Error('Unknown Error');
      });
      // When
      const result = await controller.getTracks(payloadMock);
      // Then
      expect(result).toEqual('ERROR');
    });
  });
});
