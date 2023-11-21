/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { CsmrTracksErrorCode } from '../enums';
import { CsmrTracksBaseException } from './csmr-tracks-base.exception';

@Description(
  "Le champ service de la trace n'a pas permis de déterminer le type d'instance pour lequel formatter la trace",
)
export class CsmrTracksUnknownInstanceException extends CsmrTracksBaseException {
  public readonly code = CsmrTracksErrorCode.UNKNOWN_INSTANCE;
  public readonly message = 'Found unknown instance (service) in track';
}
