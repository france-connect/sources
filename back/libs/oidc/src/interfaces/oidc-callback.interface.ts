/* istanbul ignore file */

// Declarative code
import { MergeExclusive } from 'type-fest';

import { OidcError as Error } from './oidc-error.interface';

interface Mandatory {
  readonly state: string;
}

interface Success {
  readonly code: string;
}

export type OidcCallbackInterface = Mandatory & MergeExclusive<Error, Success>;
