export interface DcqlClaimQueryInterface {
  readonly id?: string;
  readonly path?: ReadonlyArray<string | number | null>;
  readonly intent_to_retain?: boolean;
}
