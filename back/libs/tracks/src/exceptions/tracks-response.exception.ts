/* istanbul ignore file */

// declarative file
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { TracksBaseException } from './tracks-base.exception';

@Description(
  "Une erreur s'est produite lors de la récupération des traces via le broker",
)
export class TracksResponseException extends TracksBaseException {
  code = ErrorCode.TRACKS_RESPONSE;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
