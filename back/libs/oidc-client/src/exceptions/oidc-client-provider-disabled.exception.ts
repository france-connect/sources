/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

@Description(
  'Le FI est désactivé, si le problème persiste, contacter le support N3',
)
export class OidcClientProviderDisabledException extends OidcClientBaseException {
  code = ErrorCode.DISABLED_PROVIDER;

  constructor() {
    super("La connexion via ce fournisseur d'identité est désactivée");
  }
}
