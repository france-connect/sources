import { Description } from '@fc/exceptions';

import { MailerBaseException } from './mailer-base.exception';

@Description(
  "Une erreur s'est produite lors de l'envoi du mail de notification. Cela peut être dû à des données obligatoires manquantes dans l'identité de l'usager ( given_name, family_name ), des données manquantes en session ( nom du FS ou du FI ), date du jour ou la configuration. Vérifier les données de l'utilisateur. Si les données sont bien présentes, contacter le support N3.",
)
export class MailerNotificationConnectException extends MailerBaseException {
  code = 2;

  constructor() {
    super('Une erreur technique est survenue, veuillez contacter le support.');
  }
}
