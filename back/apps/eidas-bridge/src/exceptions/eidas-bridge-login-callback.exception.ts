/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { EidasBridgeBaseException } from './eidas-bridge-base.exception';

@Description(
  "Le niveau de garantie eIDAS renvoyé par le bridge n'est pas suffisant par rapport à la demande du FS. Contacter le support N3",
)
export class EidasBridgeLoginCallbackException extends EidasBridgeBaseException {
  code = ErrorCode.LOGIN_CALLBACK;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
}
