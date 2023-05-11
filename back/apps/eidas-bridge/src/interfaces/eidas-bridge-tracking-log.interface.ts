/* istanbul ignore file */

// Declarative file
import { TrackingLogInterface } from '@fc/tracking';

export interface EidasBridgeTrackingLogInterface extends TrackingLogInterface {
  readonly sessionId: string;
  readonly step: string;
  readonly countryCodeSrc: string;
  readonly countryCodeDst: string;
}
