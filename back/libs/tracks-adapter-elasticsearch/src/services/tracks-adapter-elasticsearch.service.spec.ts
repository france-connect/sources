import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Test, TestingModule } from '@nestjs/testing';

import { IPaginationOptions } from '@fc/common';

import {
  BaseTracksOutputInterface,
  ElasticTracksResultsInterface,
  ElasticTracksType,
} from '../interfaces';
import { ElasticTracksService } from './elastic-tracks.service';
import { TracksAdapterElasticsearchService } from './tracks-adapter-elasticsearch.service';
import { TracksFormatterService } from './tracks-formatter.service';

describe('TracksAdapterElasticsearchService', () => {
  let service: TracksAdapterElasticsearchService<BaseTracksOutputInterface>;

  const elasticServiceMock = {
    getElasticTracks: jest.fn(),
  };

  const formatterServiceMock = {
    formatTracks: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TracksAdapterElasticsearchService,
        ElasticTracksService,
        TracksFormatterService,
      ],
    })
      .overrideProvider(ElasticTracksService)
      .useValue(elasticServiceMock)
      .overrideProvider(TracksFormatterService)
      .useValue(formatterServiceMock)
      .compile();

    service = module.get<
      TracksAdapterElasticsearchService<BaseTracksOutputInterface>
    >(TracksAdapterElasticsearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTracks', () => {
    const accountIdMock = ['idValue1', 'idValue2'];

    const optionsMock: IPaginationOptions = {
      size: 42,
      offset: 12,
    };

    const elasticPayloadMock = Symbol('elasticPayload');

    const elasticTracksMock: ElasticTracksResultsInterface = {
      total: 2,
      payload: elasticPayloadMock as unknown as SearchHit<ElasticTracksType>[],
    };

    const formattedTracksMock = Symbol('formattedTracks');

    beforeEach(() => {
      elasticServiceMock.getElasticTracks.mockResolvedValue(elasticTracksMock);
      formatterServiceMock.formatTracks.mockReturnValue(formattedTracksMock);
    });

    it('should call elasticService.getElasticTracks with groupIds and options', async () => {
      // When
      await service.getTracks(accountIdMock, optionsMock);

      // Then
      expect(elasticServiceMock.getElasticTracks).toHaveBeenCalledTimes(1);
      expect(elasticServiceMock.getElasticTracks).toHaveBeenCalledWith(
        accountIdMock,
        optionsMock,
      );
    });

    it('should call formatterService.formatTracks with elasticTracks.payload', async () => {
      // When
      await service.getTracks(accountIdMock, optionsMock);

      // Then
      expect(formatterServiceMock.formatTracks).toHaveBeenCalledTimes(1);
      expect(formatterServiceMock.formatTracks).toHaveBeenCalledWith(
        elasticPayloadMock,
      );
    });

    it('should return an object with formatted tracks and meta from elasticTracks', async () => {
      // When
      const result = await service.getTracks(accountIdMock, optionsMock);

      // Then
      expect(result).toEqual({
        total: elasticTracksMock.total,
        payload: formattedTracksMock,
      });
    });
  });
});
