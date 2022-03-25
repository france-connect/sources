import { ICsmrTracksElasticInput } from '@fc/csmr-tracks';

export interface ICsmrTracksHighTracks {
  event: string;
  date: string;
  accountId: string;
  spId: string;
  spName: string;
  spAcr: string;
  country: string;
  city: string;
}

export type ICsmrTracksInputHigh =
  ICsmrTracksElasticInput<ICsmrTracksHighTracks>;
