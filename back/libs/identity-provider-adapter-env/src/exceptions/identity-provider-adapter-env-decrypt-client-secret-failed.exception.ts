import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { IdentityProviderAdapterEnvBaseException } from './identity-provider-adapter-env-base.exception';

export class IdentityProviderAdapterEnvDecryptClientSecretFailedException extends IdentityProviderAdapterEnvBaseException {
  static CODE = ErrorCode.DECRYPT_CLIENT_SECRET_FAILED;
  static DOCUMENTATION =
    "Échec du déchiffrement du client_secret d'un fournisseur d'identité. Vérifier la configuration du chiffrement et la validité du client_secret. Si le problème persiste, contacter le support N3";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'IdentityProviderAdapterEnv.exceptions.decryptClientSecretFailed';
  static HTTP_STATUS_CODE = HttpStatus.INTERNAL_SERVER_ERROR;
}
