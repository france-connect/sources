export interface BridgePayload {
  url: string;
  method: string;
  headers: Record<string, string>;
  data?: string;
}
