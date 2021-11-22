/* istanbul ignore file */

// Declarative code
import { ITrackingLog } from '@fc/tracking';

export class ICoreTrackingLog extends ITrackingLog {
  readonly interactionId: string;
  readonly step: string;
  /** Service provider informations */
  readonly spId: string;
  readonly spAcr: string;
  readonly spName: string;

  /** Identity provider informations */
  readonly idpId?: string;
  readonly idpAcr?: string;
  readonly idpName?: string;

  readonly claims?: string;
}
