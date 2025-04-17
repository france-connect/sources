import { TicketTracksDataInterface } from '../interfaces';

export function getTracksBySpName(
  tracks: TicketTracksDataInterface[],
): Record<string, Partial<TicketTracksDataInterface>[]> {
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
  tracks: TicketTracksDataInterface[],
): Record<string, Partial<TicketTracksDataInterface>[]> {
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
  tracks: Partial<TicketTracksDataInterface>[],
  key: string,
): Record<string, Partial<TicketTracksDataInterface>[]> {
  return tracks.reduce(
    (result, track) => {
      const value = track[key];

      if (!result[value]) {
        result[value] = [];
      }

      result[value].push(track);

      return result;
    },
    {} as Record<string, Partial<TicketTracksDataInterface>[]>,
  );
}
