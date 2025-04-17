import { formatMultiMatchGroup } from '@fc/elasticsearch';

import { EVENT_MAPPING } from '../constants';
import { ElasticTracksType, TracksLegacyFieldsInterface } from '../interfaces';
import * as utils from './tracks-adapter-elasticsearch.util';

jest.mock('@fc/elasticsearch/helpers');

describe('formatV2query()', () => {
  it('should return es query filter by empty scope if event is DP_VERIFIED_FC_CHECKTOKEN', () => {
    // Given
    const dpVerifiedFcChecktoken = EVENT_MAPPING['checkedToken/verification'];
    const resultMock = {
      bool: {
        must: [{ term: { event: 'DP_VERIFIED_FC_CHECKTOKEN' } }],
        // es naming convention
        // eslint-disable-next-line @typescript-eslint/naming-convention
        must_not: [{ term: { scope: '' } }],
      },
    };

    // When
    const result = utils.formatV2Query(dpVerifiedFcChecktoken);

    // Then
    expect(result).toStrictEqual(resultMock);
  });

  it('should return es query filter without must_not term if event is not DP_VERIFIED_FC_CHECKTOKEN', () => {
    // Given
    const fcVerified = EVENT_MAPPING['authentication/initial'];
    const resultMock = {
      bool: {
        must: [{ term: { event: 'FC_VERIFIED' } }],
      },
    };

    // When
    const result = utils.formatV2Query(fcVerified);

    // Then
    expect(result).toStrictEqual(resultMock);
  });
});

describe('buildEventQuery()', () => {
  it('should build ES terms based on event and action data', () => {
    // Given
    const formatV2QueryResponse = {
      bool: {
        must: [
          {
            term: {
              event: 'eventValue1',
            },
          },
        ],
      },
    };

    jest
      .spyOn(utils, 'formatV2Query')
      .mockReturnValueOnce(formatV2QueryResponse);

    const formatMultiMatchGroupResponse = {
      bool: {
        must: [
          {
            bool: {
              must: [
                {
                  term: {
                    action: 'actionValue',
                  },
                },
                {
                  term: {
                    // Legacy Tracks Params
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    type_action: 'typeActionValue',
                  },
                },
              ],
            },
          },
        ],
      },
    };

    jest
      .mocked(formatMultiMatchGroup)
      .mockReturnValueOnce(formatMultiMatchGroupResponse);

    const data: [string, string] = [
      'actionValue/typeActionValue',
      'eventValue1',
    ];

    const resultMock = {
      bool: {
        should: [
          {
            bool: {
              must: [
                {
                  term: {
                    event: 'eventValue1',
                  },
                },
              ],
            },
          },
          {
            bool: {
              must: [
                {
                  bool: {
                    must: [
                      {
                        term: {
                          action: 'actionValue',
                        },
                      },
                      {
                        term: {
                          // Legacy Tracks Params
                          // eslint-disable-next-line @typescript-eslint/naming-convention
                          type_action: 'typeActionValue',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    };

    // When
    const result = utils.buildEventQuery(data);

    // Then
    expect(result).toStrictEqual(resultMock);
  });
});

describe('getContextFromLegacyTracks()', () => {
  it('should return spName and idpName from track', () => {
    // Given
    const track = {
      // Legacy Tracks Params
      // eslint-disable-next-line @typescript-eslint/naming-convention
      fs_label: 'spNameMock',
      fsId: 'spIdMock',
      fi: 'idpNameMock',
      fiId: 'idpIdMock',
      fiSub: 'idpSubMock',
      fsSub: 'spSubMock',
      eidas: 'interactionAcrMock',
      cinematicID: 'interactionIdMock',
      sessionID: 'browsingSessionIdMock',
    } as unknown as TracksLegacyFieldsInterface;

    const expected = {
      spName: 'spNameMock',
      spId: 'spIdMock',
      idpName: 'idpNameMock',
      idpId: 'idpIdMock',
      idpSub: 'idpSubMock',
      spSub: 'spSubMock',
      interactionId: 'interactionIdMock',
      interactionAcr: 'interactionAcrMock',
      browsingSessionId: 'browsingSessionIdMock',
    };

    // When
    const result = utils.getContextFromLegacyTracks(track);

    // Then
    expect(result).toStrictEqual(expected);
  });
});

describe('getLocationFromTracks()', () => {
  it('should return country and city from track.source.geo', () => {
    // Given
    const track = {
      source: {
        geo: {
          // Input data
          // eslint-disable-next-line @typescript-eslint/naming-convention
          city_name: 'CityName',
          // Input data
          // eslint-disable-next-line @typescript-eslint/naming-convention
          country_iso_code: 'CountryCode',
          // Input data
          // eslint-disable-next-line @typescript-eslint/naming-convention
          region_name: 'RegionName',
        },
      },
    } as unknown as ElasticTracksType;

    const expected = {
      country: 'CountryCode',
      city: 'CityName',
    };

    // When
    const result = utils.getLocationFromTracks(track);

    // Then
    expect(result).toStrictEqual(expected);
  });

  it('should return region as city if city_name is missing', () => {
    // Given
    const track = {
      source: {
        geo: {
          // Input data
          // eslint-disable-next-line @typescript-eslint/naming-convention
          country_iso_code: 'CountryCode',
          // Input data
          // eslint-disable-next-line @typescript-eslint/naming-convention
          region_name: 'RegionName',
        },
      },
    } as unknown as ElasticTracksType;

    const expected = {
      country: 'CountryCode',
      city: 'RegionName',
    };

    // When
    const result = utils.getLocationFromTracks(track);

    // Then
    expect(result).toStrictEqual(expected);
  });

  it('should return undefined if geo is missing', () => {
    // Given
    const track = {
      source: {},
    } as unknown as ElasticTracksType;

    const expected = {
      country: undefined,
      city: undefined,
    };

    // When
    const result = utils.getLocationFromTracks(track);

    // Then
    expect(result).toStrictEqual(expected);
  });
});

describe('getIpAddressFromTracks()', () => {
  it('should return track.source.address', () => {
    // Given
    const track = {
      source: {
        address: ['ipAddress'],
      },
    } as unknown as ElasticTracksType;

    // When
    const result = utils.getIpAddressFromTracks(track);

    // Then
    expect(result).toStrictEqual(['ipAddress']);
  });
});
