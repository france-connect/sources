/* istanbul ignore file */

// Declarative code

import { CoreInstance } from '../enums';
import { ICsmrTracksGeoData } from './csmr-tracks-geo.interface';

/**
 * Piece of data specific to core-high from ElasticSearch source
 */
export type ICsmrTracksV2Data = {
  idpName: string;
  idpId: string;
  event: string;
  ip: string;
  idpSub: string;
  service: CoreInstance;
  spSub: string;
  spId: string;
  spName: string;
  idpAcr: string;
  idpLabel: string;
  spAcr: string;
  claims?: string;
  time: number;
};

/**
 * data specific to core-high from ElasticSearch source with geo and script generated data
 */
export type ICsmrTracksV2FieldsData = Readonly<
  ICsmrTracksV2Data & ICsmrTracksGeoData
>;
