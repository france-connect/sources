import { DateTime } from 'luxon';

import type { CinematicEvents, EidasToLabel } from '../enums';
import type { EnhancedTrack, IRichClaim, TrackList, TracksConfig } from '../interfaces';
import {
  groupByDataProvider,
  groupByDataProviderReducer,
  groupTracksByMonth,
  orderGroupByKeyAsc,
  orderTracksByDateDesc,
  transformTrackToEnhanced,
} from './tracks.util';

const claims1: IRichClaim = {
  identifier: 'claims1',
  label: 'Claims 1 Label',
  provider: {
    key: 'provider1',
    label: 'Provider 1',
  },
};

const claims2: IRichClaim = {
  identifier: 'claims2',
  label: 'Claims 2 Label',
  provider: {
    key: 'provider1',
    label: 'Provider 1',
  },
};

// Fixtures
const dateTrack1 = 1317826080000; // '2011-10-05T14:48:00.000Z'
const track1: EnhancedTrack = {
  city: 'Acme City',
  claims: [claims1, claims2],
  country: 'Acme Country',
  datetime: DateTime.fromMillis(dateTrack1, { zone: 'Europe/Paris' }),
  event: 'FC_REQUESTED_IDP_USERINFO' as CinematicEvents,
  idpLabel: 'Ameli',
  platform: 'FranceConnect',
  spAcr: 'eidas1' as keyof typeof EidasToLabel,
  spLabel: 'Acme Service Provider',
  time: dateTrack1,
  trackId: 'trackId-1',
};

const dateTrack2 = 1317912480000; // '2011-10-06T14:48:00.000Z'
const track2: EnhancedTrack = {
  city: 'Acme City',
  claims: [],
  country: 'Acme Country',
  datetime: DateTime.fromMillis(dateTrack2, { zone: 'Europe/Paris' }),
  event: 'FC_REQUESTED_IDP_USERINFO' as CinematicEvents,
  idpLabel: 'Ameli',

  platform: 'FranceConnect+',
  spAcr: 'eidas1' as keyof typeof EidasToLabel,
  spLabel: 'Acme Service Provider',
  time: dateTrack2,
  trackId: 'trackId-2',
};

const dateTrack3 = 1349448480000; // '2012-10-05T14:48:00.000Z'
const track3: EnhancedTrack = {
  city: 'Acme City',
  claims: [claims1, claims2],
  country: 'Acme Country',
  datetime: DateTime.fromMillis(dateTrack3, { zone: 'Europe/Paris' }),
  event: 'FC_REQUESTED_IDP_USERINFO' as CinematicEvents,
  idpLabel: 'Ameli',
  platform: 'FranceConnect',
  spAcr: 'eidas1' as keyof typeof EidasToLabel,
  spLabel: 'Acme Service Provider',
  time: dateTrack3,
  trackId: 'trackId-3',
};

const configMock = {
  LUXON_FORMAT_MONTH_YEAR: 'LLLL yyyy',
} as TracksConfig;

describe('groupTracksByMonth', () => {
  it('doit retourner une track dans un seul groupe', () => {
    // when
    const results = groupTracksByMonth(configMock)([], track1, 0);

    // then
    expect(results).toHaveLength(1);
    expect(results[0][1].tracks).toHaveLength(1);
    expect(results[0][1].tracks[0]).toStrictEqual(track1);
    expect(results[0][1].label).toBe('octobre 2011');
  });

  it('doit retourner deux tracks dans un seul groupe', () => {
    // given
    const tracks = [track1, track2];

    // when
    const results = tracks.reduce(groupTracksByMonth(configMock), []);

    // then
    expect(results).toHaveLength(1);
    expect(results[0][1].tracks).toHaveLength(2);
    expect(results[0][1].tracks[0]).toStrictEqual(track1);
    expect(results[0][1].tracks[1]).toStrictEqual(track2);
    expect(results[0][1].label).toBe('octobre 2011');
  });

  it('doit retourner trois tracks dans deux groupes (2|1)', () => {
    // given
    const tracks = [track1, track2, track3];

    // when
    const results = tracks.reduce(groupTracksByMonth(configMock), []);

    // then
    expect(results).toHaveLength(2);
    // first group
    expect(results[0][1].tracks).toHaveLength(2);
    expect(results[0][1].tracks[0]).toStrictEqual(track1);
    expect(results[0][1].tracks[1]).toStrictEqual(track2);
    expect(results[0][1].label).toBe('octobre 2011');
    // seconds group
    expect(results[1][1].tracks).toHaveLength(1);
    expect(results[1][1].tracks[0]).toStrictEqual(track3);
    expect(results[1][1].label).toBe('octobre 2012');
  });
});

describe('orderGroupByKeyAsc', () => {
  it('doit retourner un tableau ordonner par la clé unique (timestamp)', () => {
    // given
    const sortable = [[456, {}] as TrackList, [789, {}] as TrackList, [123, {}] as TrackList];

    // when
    const result = sortable.sort(orderGroupByKeyAsc);

    // then
    expect(result).toStrictEqual([
      [789, {}],
      [456, {}],
      [123, {}],
    ]);
  });
});

describe('orderTracksByDateDesc', () => {
  it('doit retourner un tableau ordonné par la clé unique (timestamp)', () => {
    // given
    const sortable = [
      //  '2011-09-02T14:48:00.000Z'
      { time: 1314974880000 } as EnhancedTrack,
      // '2011-10-06T14:48:00.000Z'
      { time: 1317912480000 } as EnhancedTrack,
      // 2011-09-01T14:48:00.000Z
      { time: 1314888480000 } as EnhancedTrack,
    ];

    // when
    const result = sortable.sort(orderTracksByDateDesc);

    // then
    expect(result).toStrictEqual([
      { time: 1317912480000 },
      { time: 1314974880000 },
      { time: 1314888480000 },
    ]);
  });
});

describe('transformTrackToEnhanced', () => {
  it('doit retourner un objet avec une propriéte datetime de type luxon', () => {
    // when
    const result = transformTrackToEnhanced(track1);

    // then
    expect(result).toStrictEqual({
      ...track1,
      datetime: DateTime.fromMillis(track1.time),
    });
  });
});

describe('groupByDataProviderReducer', () => {
  it('should return an object with expected format', () => {
    // Given
    const accMock = {};
    const claimMock: IRichClaim = {
      identifier: 'foo',
      label: 'Claim Mock Label',
      provider: {
        key: 'providerKey',
        label: 'Provider Label',
      },
    };

    // When
    const result = groupByDataProviderReducer(accMock, claimMock);

    // Then
    expect(result).toEqual({
      providerKey: {
        claims: ['Claim Mock Label'],
        label: 'Provider Label',
      },
    });
  });
});

describe('groupByDataProvider', () => {
  it('should call reduce with groupByDataProviderReducer', () => {
    // Given
    const claimsMock = [] as IRichClaim[];
    jest.spyOn(claimsMock, 'reduce').mockImplementation();

    // When
    groupByDataProvider(claimsMock);

    // Then
    expect(claimsMock.reduce).toHaveBeenCalledOnce();
    expect(claimsMock.reduce).toHaveBeenCalledWith(groupByDataProviderReducer, expect.any(Object));
  });

  it('should return result from call to reduce', () => {
    // Given
    const claimsMock = [] as IRichClaim[];
    const claimsReduceMockedReturn = Symbol('claimsReduceMockedReturnValue');
    jest.spyOn(claimsMock, 'reduce').mockImplementation().mockReturnValue(claimsReduceMockedReturn);

    // When
    const result = groupByDataProvider(claimsMock);

    // Then
    expect(result).toBe(claimsReduceMockedReturn);
  });
});
