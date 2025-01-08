import { ICoreTrackingContext } from '@fc/core';

export interface CoreFcaTrackingContextInterface extends ICoreTrackingContext {
  readonly fqdn?: string;
}
