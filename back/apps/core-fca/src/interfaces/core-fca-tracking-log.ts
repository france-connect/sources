import { TrackingLogInterface } from '@fc/tracking';

export interface CoreFcaTrackingLogInterface extends TrackingLogInterface {
  readonly fqdn?: string;
}
