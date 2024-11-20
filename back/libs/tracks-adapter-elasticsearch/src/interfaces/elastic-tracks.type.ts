/* istanbul ignore file */

// Declarative code
import { TracksLegacyFieldsInterface } from './tracks-legacy-fields.interface';
import { TracksV2FieldsInterface } from './tracks-v2-fields.interface';

/**
 * General type to accept CoreHigh and Legacy type
 */
export type ElasticTracksType =
  | TracksLegacyFieldsInterface
  | TracksV2FieldsInterface;
