import { ICsmrTracksElasticInput } from '@fc/csmr-tracks';

export interface ICsmrTracksHighTrack {
  /** event informations */
  readonly category: string;
  readonly event: string;
  readonly step: string;

  /** Service provider informations */
  readonly spId: string;
  readonly spAcr: string;
  readonly spName: string;

  /** Identity provider informations */
  readonly idpId: string;
  readonly idpAcr: string;
  readonly idpName: string;

  /** User informations */
  readonly ip: string;
  readonly accountId: string;
  readonly spSub: string;
  readonly idpSub: string;
  readonly claims?: string;

  /** Technical informations */
  readonly interactionId: string;
  readonly level: 'info';
  readonly time: number;
  readonly pid: number;
  readonly hostname: string;
  readonly logId: string;
  readonly '@version': string;
}

export type ICsmrTracksInputHigh =
  ICsmrTracksElasticInput<ICsmrTracksHighTrack>;
