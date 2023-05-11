/* istanbul ignore file */

// Declarative file
import { TrackedEventInterface } from '@fc/tracking';

export interface EidasBridgeTrackedEventInterface
  extends TrackedEventInterface {
  readonly countryCodeSrc: string;
  readonly countryCodeDst: string;
}
