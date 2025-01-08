import { ErrorCode } from '../enums';
import { ApacheIgniteBaseException } from './apache-ignite-base.exception';

export class ApacheIgniteInvalidSocketException extends ApacheIgniteBaseException {
  static CODE = ErrorCode.INVALID_SOCKET;
  static DOCUMENTATION =
    "Le socket entre le bridge et le cache apache ignite n'existe pas. Problème de connexion entre le bridge et le noeud. Impossible de mettre en place le keep alive.";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'ApacheIgnite.exceptions.invalidSocket';
}
