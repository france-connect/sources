import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { Openid4vpBaseException } from './openid4vp-base.exception';

export class Openid4vpInvalidX509CertificateChainException extends Openid4vpBaseException {
  static CODE = ErrorCode.INVALID_X509_CERTIFICATE_CHAIN;
  static DOCUMENTATION =
    'OpenID4VP X.509 configuration must contain at least one PEM certificate.';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION = 'OID4VP X.509 certificate chain is invalid';
  static HTTP_STATUS_CODE = HttpStatus.INTERNAL_SERVER_ERROR;
}
