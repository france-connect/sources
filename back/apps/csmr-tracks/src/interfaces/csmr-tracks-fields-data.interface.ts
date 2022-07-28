/* istanbul ignore file */

// Declarative code
import { valueToArray } from '@fc/common';

import { ICsmrTracksHighFieldsData } from './csmr-tracks-high-fields-data.interface';
import { ICsmrTracksLegacyFieldsData } from './csmr-tracks-legacy-fields-data.interface';

/**
 * General type to accept CoreHigh and Legacy type
 */
export type ICsmrTracksData =
  | ICsmrTracksHighFieldsData
  | ICsmrTracksLegacyFieldsData;

/**
 * Specific type for fields output from Elasticsearch hits.
 */
export type ICsmrTracksFieldsRawData = valueToArray<ICsmrTracksData>;
