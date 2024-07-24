import { DateTime } from 'luxon';

import type {
  EnhancedTrack,
  IGroupedClaims,
  IRichClaim,
  Track,
  TrackList,
  TracksConfig,
} from '../interfaces';

export function createUniqueGroupKeyFromTrackDate(track: EnhancedTrack): number {
  // crée une clé unique pour un groupe
  // à partir de l'année et du mois

  const localeDate = track.datetime.setZone('Europe/Paris').setLocale('fr-FR');
  const next = DateTime.fromObject({
    month: localeDate.month,
    year: localeDate.year,
  }).toMillis();
  return next;
}

export const groupTracksByMonth =
  (options: TracksConfig) =>
  (acc: TrackList[], track: EnhancedTrack, index: number): TrackList[] => {
    const isFirstTrack = index === 0;
    const previousGroup = isFirstTrack ? [] : acc[acc.length - 1];
    const previousGroupKey = (previousGroup && previousGroup[0]) || null;

    const currentGroupKey = createUniqueGroupKeyFromTrackDate(track);
    const isNotSameMonthYearGroup = currentGroupKey !== previousGroupKey;
    const shouldCreateNewTrackList = isFirstTrack || isNotSameMonthYearGroup;

    const nextTrackList = (
      !shouldCreateNewTrackList ? acc.pop() : [currentGroupKey, { label: null, tracks: [] }]
    ) as TrackList;

    nextTrackList[1].label = !shouldCreateNewTrackList
      ? nextTrackList[1].label
      : track.datetime
          .setZone('Europe/Paris')
          .setLocale('fr-FR')
          .toFormat(options.LUXON_FORMAT_MONTH_YEAR);

    nextTrackList[1].tracks = !shouldCreateNewTrackList
      ? [...(previousGroup && previousGroup[1].tracks), track]
      : [track];

    const next = [...acc, nextTrackList];
    return next;
  };

export function orderGroupByKeyAsc([uniqKeyA]: TrackList, [uniqKeyB]: TrackList) {
  return uniqKeyB - uniqKeyA;
}

export function orderTracksByDateDesc({ time: a }: EnhancedTrack, { time: b }: EnhancedTrack) {
  return b - a;
}

export function transformTrackToEnhanced(track: Track): EnhancedTrack {
  const datetime = DateTime.fromMillis(track.time);
  return { ...track, datetime };
}

export function groupByDataProviderReducer(acc: IGroupedClaims, claim: IRichClaim): IGroupedClaims {
  const { label, slug: name } = claim.provider;

  if (!acc[name]) {
    acc[name] = {
      claims: [],
      label,
    };
  }

  acc[name].claims.push(claim.label);

  return acc;
}

export function groupByDataProvider(claims: IRichClaim[]): IGroupedClaims {
  const grouped = claims.reduce(groupByDataProviderReducer, {} as IGroupedClaims);

  return grouped;
}
