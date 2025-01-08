import { ErrorCode } from '../enums';
import { CsmrFraudClientBaseException } from './csmr-fraud-client-base.exception';

export class CsmrFraudClientResponseException extends CsmrFraudClientBaseException {
  static DOCUMENTATION =
    "Une erreur s'est produite lors du traitement du formulaire usurpation via le broker";
  static CODE = ErrorCode.CSMR_FRAUD_CLIENT_RESPONSE;
  static UI =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
