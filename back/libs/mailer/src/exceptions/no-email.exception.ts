import { ErrorCode } from '../enums';
import { MailerBaseException } from './mailer-base.exception';

export class NoEmailException extends MailerBaseException {
  static CODE = ErrorCode.NO_EMAIL;
  static DOCUMENTATION =
    "L'identité de l'utilisateur transmise par le fournisseur d'identité ne contient pas de mail. Il n'est pas possible de lui envoyer le mail de notification. Demander au FI de compléter l'identité de l'utilisateur";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'Mailer.exceptions.noEmail';
}
