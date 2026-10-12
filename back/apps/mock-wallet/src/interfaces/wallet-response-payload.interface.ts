export type DcqlVpToken = Record<string, string[]>;

export interface WalletResponsePayload {
  readonly state?: string;
  readonly vp_token: DcqlVpToken;
}
