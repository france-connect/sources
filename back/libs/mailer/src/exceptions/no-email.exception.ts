/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { MailerBaseException } from './mailer-base.exception';

@Description(
  "L'identité de l'utilisateur transmise par le fournisseur d'identité ne contient pas de mail. Il n'est pas possible de lui envoyer le mail de notification. Demander au FI de compléter l'identité de l'utilisateur",
)
export class NoEmailException extends MailerBaseException {
  code = 1;

  constructor() {
    super(
      'Les informations sur votre identité sont incomplètes et ne permettent pas de vous connecter à votre service. Veuillez contacter le support.',
    );
  }
}
