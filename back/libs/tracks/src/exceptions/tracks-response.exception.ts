/* istanbul ignore file */

// declarative file
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { TracksBaseException } from './tracks-base.exception';

@Description(
  "Une erreur s'est produite lors de la récupération des traces via le broker",
)
export class TracksResponseException extends TracksBaseException {
  code = ErrorCode.TRACKS_RESPONSE;
}
