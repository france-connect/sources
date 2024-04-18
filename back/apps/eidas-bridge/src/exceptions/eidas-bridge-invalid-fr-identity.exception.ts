/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '@fc/core';
import { Description } from '@fc/exceptions-deprecated';

import { EidasBridgeBaseException } from './eidas-bridge-base.exception';

@Description(
  "L'identité reçue du fournisseur d'identité français n'est pas valide. Contacter le support N3",
)
export class EidasBridgeInvalidFRIdentityException extends EidasBridgeBaseException {
  code = ErrorCode.INVALID_IDENTITY;
  message =
    "Un problème lié à vos données d'identité empêche la connexion d'aboutir. Nous vous invitons à nous contacter pour corriger le problème.";
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
}
