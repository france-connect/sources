/* istanbul ignore file */

// Declarative code

import { ICsmrTracksGeneratedData } from './csmr-tracks-generated-data.interface';
import { ICsmrTracksGeoData } from './csmr-tracks-geo.interface';

/**
 * Piece of data specific to core-high from ElasticSearch source
 */
export type ICsmrTracksHighData = {
  idpName: string;
  idpId: string;
  event: string;
  ip: string;
  idpSub: string;
  spSub: string;
  spId: string;
  idpAcr: string;
  idpLabel: string;
  spAcr: string;
  claims?: string;
  time: string; // /!\ timestamp as string !
};

/**
 * data specific to core-high from ElasticSearch source with geo and script generated data
 */
export type ICsmrTracksHighFieldsData = Readonly<
  ICsmrTracksHighData & ICsmrTracksGeoData & ICsmrTracksGeneratedData
>;

export type ICsmrTracksHighTransformData = Omit<
  ICsmrTracksHighFieldsData,
  'trackId' | 'platform'
>;
