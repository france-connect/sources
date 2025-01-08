import { TracksTicketDataInterface } from '../interfaces';

export function getTracksBySpName(
  tracks: TracksTicketDataInterface[],
): Record<string, Partial<TracksTicketDataInterface>[]> {
  return groupTracksByKey(
    tracks.map(
      ({
        idpSub: _idpSub,
        idpName: _idpName,
        accountIdMatch: _accountIdMatch,
        ...rest
      }) => rest,
    ),
    'spName',
  );
}

export function getTracksByIdpName(
  tracks: TracksTicketDataInterface[],
): Record<string, Partial<TracksTicketDataInterface>[]> {
  return groupTracksByKey(
    tracks.map(
      ({
        spSub: _spSub,
        spName: _spName,
        accountIdMatch: _accountIdMatch,
        ...rest
      }) => rest,
    ),
    'idpName',
  );
}

function groupTracksByKey(
  tracks: Partial<TracksTicketDataInterface>[],
  key: string,
): Record<string, Partial<TracksTicketDataInterface>[]> {
  return tracks.reduce(
    (result, track) => {
      const value = track[key];

      if (!result[value]) {
        result[value] = [];
      }

      result[value].push(track);

      return result;
    },
    {} as Record<string, Partial<TracksTicketDataInterface>[]>,
  );
}
