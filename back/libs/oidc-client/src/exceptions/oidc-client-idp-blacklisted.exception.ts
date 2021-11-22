/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

@Description(
  "Le fournisseur d'identité utilisé par l'usager n'est pas autorisé pour ce FS. Cela peut se produire uniquement lorsque l'on a ajouté le FI dans la blacklist du FS. L'utilisateur doit recommencer sa cinématique. Si le problème persiste, contacter le support N3",
)
export class OidcClientIdpBlacklistedException extends OidcClientBaseException {
  code = ErrorCode.PROVIDER_BLACKLISTED_OR_NON_WHITELISTED;

  constructor() {
    super(
      "Le fournisseur d'identité que vous avez choisi n'est pas autorisé pour effectuer votre démarche.",
    );
  }
}
