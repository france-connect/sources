import { DcqlCredentialQueryInterface } from './dcql-credential-query.interface';
import { DcqlCredentialSetQueryInterface } from './dcql-credential-set-query.interface';

export interface DcqlQueryInterface {
  readonly credentials: readonly DcqlCredentialQueryInterface[];
  readonly credential_sets?: readonly DcqlCredentialSetQueryInterface[];
}
