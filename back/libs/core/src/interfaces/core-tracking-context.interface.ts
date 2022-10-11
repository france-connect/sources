/* istanbul ignore file */

// Declarative code
export interface ICoreTrackingContext {
  readonly ip: string;
  readonly port: string;
  readonly originalAddresses: string;
  readonly sessionId: string;
  readonly interactionId: string;
  readonly claims?: string[];
}
