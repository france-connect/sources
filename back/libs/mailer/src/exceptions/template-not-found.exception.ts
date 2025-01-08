import { ErrorCode } from '../enums';
import { MailerBaseException } from './mailer-base.exception';

export class TemplateNotFoundException extends MailerBaseException {
  static CODE = ErrorCode.TEMPLATE_NOT_FOUND;
  static DOCUMENTATION =
    "Le modèle de mail n'est pas présent. Il faut contacter d'urgence le support N3 car aucun mail ne peut partir.";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'Mailer.exceptions.templateNotFound';
}
