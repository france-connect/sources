/* istanbul ignore file */

// Declarative code
import { TrackingLogInterface } from '@fc/tracking';

export class ICoreTrackingLog extends TrackingLogInterface {
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
  readonly idpLabel?: string;

  readonly claims?: string;
}

export interface IUserNetworkInfo {
  ip: string;
  originalAddresses: string;
  port: string;
}
