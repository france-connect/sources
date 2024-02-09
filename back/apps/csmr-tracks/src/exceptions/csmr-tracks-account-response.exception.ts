/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { CsmrTracksErrorCode } from '../enums';
import { CsmrTracksBaseException } from './csmr-tracks-base.exception';

@Description('Impossible to fetch accountId, please check the consumer results')
export class CsmrTracksAccountResponseException extends CsmrTracksBaseException {
  public readonly code = CsmrTracksErrorCode.ACCOUNT_ID_CSMR_FAILED;
  public readonly message = 'Impossible to fetch accountId';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
