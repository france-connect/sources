/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { OidcProviderBaseRenderedException } from './oidc-provider-base-rendered.exception';

export class OidcProviderSpIdNotFoundException extends OidcProviderBaseRenderedException {
  static CODE = ErrorCode.SP_ID_NOT_FOUND;
  static DOCUMENTATION =
    "Le client id associé à ce fournisseur de service n'a pas été trouvé dans le contexte. Si le problème persiste, contacter le support N3";
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'invalid client_id parameter';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'OidcProvider.exceptions.oidcProviderSpidNotFound';
}
