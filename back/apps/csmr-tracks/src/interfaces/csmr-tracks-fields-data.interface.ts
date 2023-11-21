/* istanbul ignore file */

// Declarative code
import { ICsmrTracksLegacyFieldsData } from './csmr-tracks-legacy-fields-data.interface';
import { ICsmrTracksV2FieldsData } from './csmr-tracks-v2-fields-data.interface';

/**
 * General type to accept CoreHigh and Legacy type
 */
export type ICsmrTracksData =
  | ICsmrTracksV2FieldsData
  | ICsmrTracksLegacyFieldsData;
