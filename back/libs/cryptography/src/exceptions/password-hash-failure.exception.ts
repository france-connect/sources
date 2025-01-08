import { ErrorCode } from '../enums';
import { CryptographyBaseException } from './cryptography-base.exception';

export class PasswordHashFailure extends CryptographyBaseException {
  static CODE = ErrorCode.PASSWORD_HASH_FAILURE;
  static DOCUMENTATION =
    "Une erreur est survenue lors de la vérification d'un mot de passe. Contacter le support N3.";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'Cryptography.exceptions.passwordHashFailure';
}
