import { DateTime } from 'luxon';

import type {
  EnhancedTrackInterface,
  IGroupedClaims,
  RichClaimInterface,
  TrackInterface,
  TrackListType,
  TracksConfig,
} from '../interfaces';

export function createUniqueGroupKeyFromTrackDate(track: EnhancedTrackInterface): number {
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
  (acc: TrackListType[], track: EnhancedTrackInterface, index: number): TrackListType[] => {
    const isFirstTrack = index === 0;
    const previousGroup = isFirstTrack ? [] : acc[acc.length - 1];
    const previousGroupKey = (previousGroup && previousGroup[0]) || null;

    const currentGroupKey = createUniqueGroupKeyFromTrackDate(track);
    const isNotSameMonthYearGroup = currentGroupKey !== previousGroupKey;
    const shouldCreateNewTrackList = isFirstTrack || isNotSameMonthYearGroup;

    const nextTrackList = (
      !shouldCreateNewTrackList ? acc.pop() : [currentGroupKey, { label: null, tracks: [] }]
    ) as TrackListType;

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

export function orderGroupByKeyAsc([uniqKeyA]: TrackListType, [uniqKeyB]: TrackListType) {
  return uniqKeyB - uniqKeyA;
}

export function orderTracksByDateDesc(
  { time: a }: EnhancedTrackInterface,
  { time: b }: EnhancedTrackInterface,
) {
  return b - a;
}

export function transformTrackToEnhanced(track: TrackInterface): EnhancedTrackInterface {
  const datetime = DateTime.fromMillis(track.time);
  return { ...track, datetime };
}

export function groupByDataProviderReducer(
  acc: IGroupedClaims,
  claim: RichClaimInterface,
): IGroupedClaims {
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

export function groupByDataProvider(claims: RichClaimInterface[]): IGroupedClaims {
  const grouped = claims.reduce(groupByDataProviderReducer, {} as IGroupedClaims);

  return grouped;
}
