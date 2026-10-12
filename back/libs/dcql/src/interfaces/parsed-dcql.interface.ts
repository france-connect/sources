export interface ParsedDcqlClaimInterface {
  readonly id?: string;
  readonly path?: ReadonlyArray<string | number | null>;
  readonly intent_to_retain?: boolean;
}

export interface ParsedDcqlCredentialInterface {
  readonly id: string;
  readonly format: string;
  readonly meta?: Readonly<Record<string, unknown>>;
  readonly claims?: readonly ParsedDcqlClaimInterface[];
  readonly claim_sets?: ReadonlyArray<readonly string[]>;
}

export interface ParsedDcqlCredentialSetInterface {
  readonly options: ReadonlyArray<readonly string[]>;
}

export interface ParsedDcqlQueryInterface {
  readonly credentials: readonly ParsedDcqlCredentialInterface[];
  readonly credential_sets?: readonly ParsedDcqlCredentialSetInterface[];
}
