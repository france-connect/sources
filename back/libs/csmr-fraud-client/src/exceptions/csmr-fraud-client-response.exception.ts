/* istanbul ignore file */

// declarative file
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { CsmrFraudClientBaseException } from './csmr-fraud-client-base.exception';

@Description(
  "Une erreur s'est produite lors du traitement du formulaire usurpation via le broker",
)
export class CsmrFraudClientResponseException extends CsmrFraudClientBaseException {
  code = ErrorCode.CSMR_FRAUD_CLIENT_RESPONSE;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
