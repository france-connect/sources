/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CoreFcaBaseException } from './core-fca-base.exception';

@Description(
  "Le fournisseur d'identité utilisé par l'usager n'est pas autorisé pour ce FS. Cela peut se produire uniquement lorsque l'on a ajouté le FI dans la blacklist du FS. L'utilisateur doit recommencer sa cinématique. Si le problème persiste, contacter le support AgentConnect",
)
export class CoreFcaAgentIdpBlacklistedException extends CoreFcaBaseException {
  code = ErrorCode.PROVIDER_BLACKLISTED_OR_NON_WHITELISTED;
  readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  illustration = 'access-restricted-error';
  title = 'Accès impossible';
  description =
    'Nous rencontrons des difficultés pour vous identifier. En attendant, vous pouvez créer un compte sur le site sans passer par le bouton AgentConnect';

  public displayContact = true;
  public contactMessage =
    'Si cette situation vous parait inhabituelle, vous pouvez nous signaler l’erreur.';

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
