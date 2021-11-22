import { DateTime } from 'luxon';
import { EnhancedTrack, Track, TrackList, TracksConfig } from '../interfaces';

export function createUniqueGroupKeyFromTrackDate(
  track: EnhancedTrack,
): number {
  // crée une clé unique pour un groupe
  // a partir de l'année et du mois
  const next = DateTime.fromObject({
    month: track.datetime.month,
    year: track.datetime.year,
  }).toMillis();
  return next;
}

export function groupTracksByMonth(
  options: TracksConfig,
  acc: TrackList[],
  track: EnhancedTrack,
  index: number,
): TrackList[] {
  const isFirstTrack = index === 0;
  const previousGroup = isFirstTrack ? null : acc[acc.length - 1];
  const previousGroupKey = (previousGroup && previousGroup[0]) || null;

  const currentGroupKey = createUniqueGroupKeyFromTrackDate(track);
  const isNotSameMonthYearGroup = currentGroupKey !== previousGroupKey;
  const shouldCreateNewTrackList = isFirstTrack || isNotSameMonthYearGroup;

  const nextTrackList = (
    !shouldCreateNewTrackList
      ? acc.pop()
      : [currentGroupKey, { label: null, tracks: [] }]
  ) as TrackList;

  nextTrackList[1].label = !shouldCreateNewTrackList
    ? nextTrackList[1].label
    : track.datetime.toFormat(options.LUXON_FORMAT_MONTH_YEAR);

  nextTrackList[1].tracks = !shouldCreateNewTrackList
    ? [...((previousGroup && previousGroup[1].tracks) || []), track]
    : [track];

  const next = [...acc, nextTrackList];
  return next;
}

export function orderGroupByKeyAsc(groupA: TrackList, groupB: TrackList) {
  const uniqKeyA = groupA[0];
  const uniqKeyB = groupB[0];
  return uniqKeyB - uniqKeyA;
}

export function orderTracksByDateAsc(a: EnhancedTrack, b: EnhancedTrack) {
  const key1 = new Date(a.date).getTime();
  const key2 = new Date(b.date).getTime();
  return key2 - key1;
}

export function transformTrackToEnhanced(track: Track): EnhancedTrack {
  const datetime = DateTime.fromISO(track.date);
  return { ...track, datetime };
}
