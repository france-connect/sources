import { DcqlClaimQueryInterface } from './dcql-claim-query.interface';

export interface DcqlCredentialQueryInterface {
  readonly id: string;
  readonly format: string;
  readonly meta?: Readonly<Record<string, unknown>>;
  readonly claims?: readonly DcqlClaimQueryInterface[];
  readonly claim_sets?: ReadonlyArray<ReadonlyArray<string>>;
}
