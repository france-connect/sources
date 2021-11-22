/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { MailerBaseException } from './mailer-base.exception';

@Description(
  "Le modèle de mail n'est pas présent. Il faut contacter d'urgence le support N3 car aucun mail ne peut partir.",
)
export class TemplateNotFoundException extends MailerBaseException {
  code = 3;

  constructor() {
    super('Une erreur technique est survenue, veuillez contacter le support.');
  }
}
