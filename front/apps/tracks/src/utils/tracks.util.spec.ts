import { DateTime } from 'luxon';

import type { CinematicEvents, EidasToLabel } from '../enums';
import type { EnhancedTrackInterface, RichClaimInterface, TrackListType } from '../interfaces';
import {
  groupByDataProvider,
  groupByDataProviderReducer,
  groupTracksByMonth,
  orderGroupByKeyAsc,
  orderTracksByDateDesc,
  transformTrackToEnhanced,
} from './tracks.util';

const claims1: RichClaimInterface = {
  identifier: 'claims1',
  label: 'Claims 1 Label',
  provider: {
    label: 'Provider 1',
    slug: 'provider1',
  },
};

const claims2: RichClaimInterface = {
  identifier: 'claims2',
  label: 'Claims 2 Label',
  provider: {
    label: 'Provider 1',
    slug: 'provider1',
  },
};

// Fixtures
const dateTrack1 = 1317826080000; // '2011-10-05T14:48:00.000Z'
const track1: EnhancedTrackInterface = {
  authenticationEventId: 'e33b8838-111a-4654-8f53-61b1ad4a9ce5',
  city: 'Acme City',
  claims: [claims1, claims2],
  country: 'Acme Country',
  datetime: DateTime.fromMillis(dateTrack1, { zone: 'Europe/Paris' }),
  event: 'FC_REQUESTED_IDP_USERINFO' as CinematicEvents,
  idpLabel: 'Ameli',
  interactionAcr: 'eidas1' as keyof typeof EidasToLabel,
  platform: 'FranceConnect',
  spLabel: 'Acme Service Provider',
  time: dateTrack1,
  trackId: 'trackId-1',
};

const dateTrack2 = 1317912480000; // '2011-10-06T14:48:00.000Z'
const track2: EnhancedTrackInterface = {
  authenticationEventId: '9668373d-f14f-4bce-a0c9-6fc57a3fda06',
  city: 'Acme City',
  claims: [],
  country: 'Acme Country',
  datetime: DateTime.fromMillis(dateTrack2, { zone: 'Europe/Paris' }),
  event: 'FC_REQUESTED_IDP_USERINFO' as CinematicEvents,

  idpLabel: 'Ameli',
  interactionAcr: 'eidas1' as keyof typeof EidasToLabel,
  platform: 'FranceConnect+',
  spLabel: 'Acme Service Provider',
  time: dateTrack2,
  trackId: 'trackId-2',
};

const dateTrack3 = 1349448480000; // '2012-10-05T14:48:00.000Z'
const track3: EnhancedTrackInterface = {
  authenticationEventId: '674d41c1-88ae-45f7-85a7-e4158ddd6ebc',
  city: 'Acme City',
  claims: [claims1, claims2],
  country: 'Acme Country',
  datetime: DateTime.fromMillis(dateTrack3, { zone: 'Europe/Paris' }),
  event: 'FC_REQUESTED_IDP_USERINFO' as CinematicEvents,
  idpLabel: 'Ameli',
  interactionAcr: 'eidas1' as keyof typeof EidasToLabel,
  platform: 'FranceConnect',
  spLabel: 'Acme Service Provider',
  time: dateTrack3,
  trackId: 'trackId-3',
};

describe('groupTracksByMonth', () => {
  it('doit retourner une track dans un seul groupe', () => {
    // When
    const results = groupTracksByMonth('LLLL yyyy')([], track1, 0);

    // Then
    expect(results).toHaveLength(1);
    expect(results[0][1].tracks).toHaveLength(1);
    expect(results[0][1].tracks[0]).toStrictEqual(track1);
    expect(results[0][1].label).toBe('octobre 2011');
  });

  it('doit retourner deux tracks dans un seul groupe', () => {
    // Given
    const tracks = [track1, track2];

    // When
    const results = tracks.reduce(groupTracksByMonth('LLLL yyyy'), []);

    // Then
    expect(results).toHaveLength(1);
    expect(results[0][1].tracks).toHaveLength(2);
    expect(results[0][1].tracks[0]).toStrictEqual(track1);
    expect(results[0][1].tracks[1]).toStrictEqual(track2);
    expect(results[0][1].label).toBe('octobre 2011');
  });

  it('doit retourner trois tracks dans deux groupes (2|1)', () => {
    // Given
    const tracks = [track1, track2, track3];

    // When
    const results = tracks.reduce(groupTracksByMonth('LLLL yyyy'), []);

    // Then
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
    // Given
    const sortable = [
      [456, {}] as TrackListType,
      [789, {}] as TrackListType,
      [123, {}] as TrackListType,
    ];

    // When
    const result = sortable.sort(orderGroupByKeyAsc);

    // Then
    expect(result).toStrictEqual([
      [789, {}],
      [456, {}],
      [123, {}],
    ]);
  });
});

describe('orderTracksByDateDesc', () => {
  it('doit retourner un tableau ordonné par la clé unique (timestamp)', () => {
    // Given
    const sortable = [
      //  '2011-09-02T14:48:00.000Z'
      { time: 1314974880000 } as EnhancedTrackInterface,
      // '2011-10-06T14:48:00.000Z'
      { time: 1317912480000 } as EnhancedTrackInterface,
      // 2011-09-01T14:48:00.000Z
      { time: 1314888480000 } as EnhancedTrackInterface,
    ];

    // When
    const result = sortable.sort(orderTracksByDateDesc);

    // Then
    expect(result).toStrictEqual([
      { time: 1317912480000 },
      { time: 1314974880000 },
      { time: 1314888480000 },
    ]);
  });
});

describe('transformTrackToEnhanced', () => {
  it('doit retourner un objet avec une propriéte datetime de type luxon', () => {
    // When
    const result = transformTrackToEnhanced(track1);

    // Then
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
    const claimMock: RichClaimInterface = {
      identifier: 'foo',
      label: 'Claim Mock Label',
      provider: {
        label: 'Provider Label',
        slug: 'providerKey',
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
    const claimsMock = [] as RichClaimInterface[];
    jest.spyOn(claimsMock, 'reduce').mockImplementation();

    // When
    groupByDataProvider(claimsMock);

    // Then
    expect(claimsMock.reduce).toHaveBeenCalledOnce();
    expect(claimsMock.reduce).toHaveBeenCalledWith(groupByDataProviderReducer, expect.any(Object));
  });

  it('should return result from call to reduce', () => {
    // Given
    const claimsMock = [] as RichClaimInterface[];
    const claimsReduceMockedReturn = Symbol('claimsReduceMockedReturnValue');
    jest.spyOn(claimsMock, 'reduce').mockImplementation().mockReturnValue(claimsReduceMockedReturn);

    // When
    const result = groupByDataProvider(claimsMock);

    // Then
    expect(result).toBe(claimsReduceMockedReturn);
  });
});
