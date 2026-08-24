export type WalletIdentityAttributeValue = unknown;

export type WalletIdentityAttributes = Record<
  string,
  WalletIdentityAttributeValue
>;

export interface WalletIdentity {
  readonly docType: string;
  readonly attributes: WalletIdentityAttributes;
}
