import { CoreInstance } from '../enums';
import { SourceInterface } from './tracks-geo.interface';

/**
 * Interface specific to legacy from Elasticsearch source
 */
export interface TracksLegacyFieldsInterface {
  fiSub: string;
  fsSub: string;
  userIp: string;
  fi: string;
  // Legacy field name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  fs_label: string;
  time: string;
  service: CoreInstance;
  source: SourceInterface;
  name: string;
  fiId: string;
  fsId: string;
  sessionID: string;
  cinematicID: string;
  scopes?: string;
  action: string;
  // Legacy field name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  type_action: string;
  eidas: string;
  accountId: string;
}
