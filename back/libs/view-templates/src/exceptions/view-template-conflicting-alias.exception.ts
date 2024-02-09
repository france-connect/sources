/* istanbul ignore file */

// Declarative file
import { Description } from '@fc/exceptions/decorator';

import { ErrorCode } from '../enums';
import { ViewTemplateBaseException } from './view-template-base.exception';

@Description(
  "Un alias d'opérateur de template avec ce nom est déjà enregistré. Erreur au démarrage de l'application.",
)
export class ViewTemplateConflictingAliasException extends ViewTemplateBaseException {
  public readonly code = ErrorCode.CONFLICTING_ALIAS;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';

  constructor(alias: string) {
    super();
    this.message = `View template alias "${alias}" is already registered`;
  }
}
