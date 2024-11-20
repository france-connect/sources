/* istanbul ignore file */

// Declarative file
import { ErrorCode } from '../enums';
import { MailerBaseException } from './mailer-base.exception';

export class MailerNotificationConnectException extends MailerBaseException {
  static CODE = ErrorCode.MAILER_NOTIFICATION_CONNECT;
  static DOCUMENTATION =
    "Une erreur s'est produite lors de l'envoi du mail de notification. Cela peut être dû à des données obligatoires manquantes dans l'identité de l'usager ( given_name, family_name ), des données manquantes en session ( nom du FS ou du FI ), date du jour ou la configuration. Vérifier les données de l'utilisateur. Si les données sont bien présentes, contacter le support N3.";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'Mailer.exceptions.mailerNotificationConnect';
}
