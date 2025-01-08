import { CoreInstance } from '../enums';
import { SourceInterface } from './tracks-geo.interface';

/**
 * Interface specific to core-high from ElasticSearch source
 */
export interface TracksV2FieldsInterface {
  idpName: string;
  ip: string;
  idpSub: string;
  service: CoreInstance;
  spSub: string;
  spName: string;
  idpLabel: string;
  time: number;
  source: SourceInterface;
  idpId: string;
  event: string;
  spId: string;
  idpAcr: string;
  spAcr: string;
  interactionAcr?: string;
  claims?: string;
  browsingSessionId: string;
  scope?: string;
  accountId: string;
}
