/* istanbul ignore file */

// Declarative code
import { ICsmrTracksElasticInput } from '@fc/csmr-tracks';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

interface ISource {
  geo: {
    // GeoIp Process naming
    // eslint-disable-next-line @typescript-eslint/naming-convention
    region_name?: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    region_iso_code?: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    city_name?: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    country_iso_code?: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    country_name?: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    continent_name?: string;
    location: {
      lon: number;
      lat: number;
    };
  };
}

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
  readonly idpLabel?: string;

  /** User informations */
  readonly ip: string;
  readonly accountId: string;
  readonly spSub: string;
  readonly idpSub: string;
  readonly claims?: string;
  readonly source?: ISource;

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

export type ICsmrTracksExtractedData = Omit<
  ICsmrTracksOutputTrack,
  'platform' | 'trackId'
>;
