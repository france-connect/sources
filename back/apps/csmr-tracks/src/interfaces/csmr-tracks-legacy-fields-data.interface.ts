/* istanbul ignore file */

// Declarative code

import { CoreInstance } from '../enums';
import { ISource } from './csmr-tracks-geo.interface';

/**
 * Piece of data specific to legacy from ElasticSearch source
 */
export type ICsmrTracksLegacyFieldsData = {
  name: string;
  fiId: string;
  fiSub: string;
  fsId: string;
  fsSub: string;
  scopes?: string;
  userIp: string;
  action: string;
  // Legacy field name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  type_action: string;
  fi: string;
  // Legacy field name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  fs_label: string;
  eidas: string;
  time: string;
  service: CoreInstance;
  source: ISource;
};
