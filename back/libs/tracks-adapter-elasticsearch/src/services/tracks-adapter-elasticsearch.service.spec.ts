import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Test, TestingModule } from '@nestjs/testing';

import { IPaginationOptions } from '@fc/common';

import {
  ElasticTracksResultsInterface,
  ElasticTracksType,
  TracksFormatterOutputAbstract,
} from '../interfaces';
import { ElasticTracksService } from './elastic-tracks.service';
import { TracksAdapterElasticsearchService } from './tracks-adapter-elasticsearch.service';
import { TracksFormatterService } from './tracks-formatter.service';

describe('TracksAdapterElasticsearchService', () => {
  let service: TracksAdapterElasticsearchService<TracksFormatterOutputAbstract>;

  const elasticServiceMock = {
    getElasticTracksForAccountIds: jest.fn(),
    getElasticTracksForAuthenticationEventId: jest.fn(),
  };

  const formatterServiceMock = {
    formatTracks: jest.fn(),
  };

  const elasticPayloadMock = Symbol('elasticPayload');

  const elasticTracksMock: ElasticTracksResultsInterface = {
    total: 2,
    payload: elasticPayloadMock as unknown as SearchHit<ElasticTracksType>[],
  };

  const formattedTracksMock = Symbol('formattedTracks');

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
      TracksAdapterElasticsearchService<TracksFormatterOutputAbstract>
    >(TracksAdapterElasticsearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTracksForAccountIds', () => {
    const accountIdMock = ['idValue1', 'idValue2'];

    const optionsMock: IPaginationOptions = {
      size: 42,
      offset: 12,
    };

    beforeEach(() => {
      elasticServiceMock.getElasticTracksForAccountIds.mockResolvedValue(
        elasticTracksMock,
      );
      formatterServiceMock.formatTracks.mockReturnValue(formattedTracksMock);
    });

    it('should call elasticService.getTracksForAccountIds with groupIds and options', async () => {
      // When
      await service.getTracksForAccountIds(accountIdMock, optionsMock);

      // Then
      expect(
        elasticServiceMock.getElasticTracksForAccountIds,
      ).toHaveBeenCalledTimes(1);
      expect(
        elasticServiceMock.getElasticTracksForAccountIds,
      ).toHaveBeenCalledWith(accountIdMock, optionsMock);
    });

    it('should call formatterService.formatTracks with elasticTracks.payload', async () => {
      // When
      await service.getTracksForAccountIds(accountIdMock, optionsMock);

      // Then
      expect(formatterServiceMock.formatTracks).toHaveBeenCalledTimes(1);
      expect(formatterServiceMock.formatTracks).toHaveBeenCalledWith(
        elasticPayloadMock,
      );
    });

    it('should return an object with formatted tracks and total from elasticTracks', async () => {
      // When
      const result = await service.getTracksForAccountIds(
        accountIdMock,
        optionsMock,
      );

      // Then
      expect(result).toEqual({
        total: elasticTracksMock.total,
        payload: formattedTracksMock,
      });
    });
  });

  describe('getTracksForAuthenticationEventId', () => {
    const authenticationEventIdMock = 'idValue1';

    beforeEach(() => {
      elasticServiceMock.getElasticTracksForAuthenticationEventId.mockResolvedValue(
        elasticTracksMock,
      );
      formatterServiceMock.formatTracks.mockReturnValue(formattedTracksMock);
    });

    it('should call elasticService.getElasticTracksForAuthenticationEventId with authenticationEventId', async () => {
      // When
      await service.getTracksForAuthenticationEventId(
        authenticationEventIdMock,
      );

      // Then
      expect(
        elasticServiceMock.getElasticTracksForAuthenticationEventId,
      ).toHaveBeenCalledTimes(1);
      expect(
        elasticServiceMock.getElasticTracksForAuthenticationEventId,
      ).toHaveBeenCalledWith(authenticationEventIdMock);
    });

    it('should call formatterService.formatTracks with elasticTracks.payload', async () => {
      // When
      await service.getTracksForAuthenticationEventId(
        authenticationEventIdMock,
      );
      // Then
      expect(formatterServiceMock.formatTracks).toHaveBeenCalledTimes(1);
      expect(formatterServiceMock.formatTracks).toHaveBeenCalledWith(
        elasticPayloadMock,
      );
    });

    it('should return an object with formatted tracks and total from elasticTracks', async () => {
      // When
      const result = await service.getTracksForAuthenticationEventId(
        authenticationEventIdMock,
      );

      // Then
      expect(result).toEqual({
        total: elasticTracksMock.total,
        payload: formattedTracksMock,
      });
    });
  });
});
