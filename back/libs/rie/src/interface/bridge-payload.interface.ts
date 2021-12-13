/* istanbul ignore file */

// Declarative code
export interface BridgePayload {
  url: string;
  method: string;
  headers: Record<string, unknown>;
  data: string | null;
}
