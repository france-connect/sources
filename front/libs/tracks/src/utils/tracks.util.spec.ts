import { DateTime } from 'luxon';

import { EidasToLabel } from '../enums';
import { EnhancedTrack, TrackList, TracksConfig } from '../interfaces';
import {
  groupTracksByMonth,
  orderGroupByKeyAsc,
  orderTracksByDateDesc,
  transformTrackToEnhanced,
} from './tracks.util';

// Fixtures
const dateTrack1 = '2011-10-05T14:48:00.000Z';
const track1: EnhancedTrack = {
  city: 'Acme City',
  claims: ['claims1Mock', 'claims2Mock'],
  country: 'Acme Country',
  date: dateTrack1,
  datetime: DateTime.fromISO(dateTrack1, { zone: 'Europe/Paris' }),
  event: 'FC_REQUESTED_IDP_USERINFO',
  platform: 'FranceConnect',
  spAcr: 'eidas1' as keyof typeof EidasToLabel,
  spName: 'Acme Service Provider',
  trackId: 'trackId-1',
};

const dateTrack2 = '2011-10-06T14:48:00.000Z';
const track2: EnhancedTrack = {
  city: 'Acme City',
  claims: null,
  country: 'Acme Country',
  date: dateTrack2,
  datetime: DateTime.fromISO(dateTrack2, { zone: 'Europe/Paris' }),
  event: 'FC_REQUESTED_IDP_USERINFO',
  platform: 'FranceConnect+',
  spAcr: 'eidas1' as keyof typeof EidasToLabel,
  spName: 'Acme Service Provider',
  trackId: 'trackId-2',
};

const dateTrack3 = '2012-10-05T14:48:00.000Z';
const track3: EnhancedTrack = {
  city: 'Acme City',
  claims: ['claims1Mock', 'claims2Mock'],
  country: 'Acme Country',
  date: dateTrack3,
  datetime: DateTime.fromISO(dateTrack3, { zone: 'Europe/Paris' }),
  event: 'FC_REQUESTED_IDP_USERINFO',
  platform: 'FranceConnect',
  spAcr: 'eidas1' as keyof typeof EidasToLabel,
  spName: 'Acme Service Provider',
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
    expect(results[0][1].label).toStrictEqual('October 2011');
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
    expect(results[0][1].label).toStrictEqual('October 2011');
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
    expect(results[0][1].label).toStrictEqual('October 2011');
    // seconds group
    expect(results[1][1].tracks).toHaveLength(1);
    expect(results[1][1].tracks[0]).toStrictEqual(track3);
    expect(results[1][1].label).toStrictEqual('October 2012');
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
  it('doit retourner un tableau ordonner par la clé unique (timestamp)', () => {
    // given
    const sortable = [
      { date: '2011-09-02T14:48:00.000Z' } as EnhancedTrack,
      { date: '2011-10-06T14:48:00.000Z' } as EnhancedTrack,
      { date: '2011-09-01T14:48:00.000Z' } as EnhancedTrack,
    ];
    // when
    const result = sortable.sort(orderTracksByDateDesc);
    // then
    expect(result).toStrictEqual([
      { date: '2011-10-06T14:48:00.000Z' },
      { date: '2011-09-02T14:48:00.000Z' },
      { date: '2011-09-01T14:48:00.000Z' },
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
      datetime: DateTime.fromISO(track1.date),
    });
  });
});
