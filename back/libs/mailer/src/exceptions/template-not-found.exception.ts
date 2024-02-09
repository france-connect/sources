/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { MailerBaseException } from './mailer-base.exception';

@Description(
  "Le modèle de mail n'est pas présent. Il faut contacter d'urgence le support N3 car aucun mail ne peut partir.",
)
export class TemplateNotFoundException extends MailerBaseException {
  code = 3;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';

  constructor() {
    super('Une erreur technique est survenue, veuillez contacter le support.');
  }
}
