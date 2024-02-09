/* istanbul ignore file */

import { NetworkContextInterface } from '@fc/tracking-context';

// Declarative code
export interface ICoreTrackingContext {
  readonly source: NetworkContextInterface;
  readonly sessionId: string;
  readonly interactionId: string;
  readonly claims?: string[];
  readonly scope?: string;

  readonly dpId?: string;
  readonly dpTitle?: string;
  readonly dpClientId?: string;
}
