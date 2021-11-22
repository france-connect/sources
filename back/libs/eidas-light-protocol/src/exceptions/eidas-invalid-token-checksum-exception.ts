/* istanbul ignore file */

// declarative code
import { Description, FcException } from '@fc/exceptions';

import { ErrorCode } from '../enums';

@Description(
  'Problème de connexion entre le bridge eIDAS et le noeud eIDAS; contacter le service technique (La somme de contrôle du LightToken reçu est invalide. Le token a possiblement été altéré.',
)
export class EidasInvalidTokenChecksumException extends FcException {
  message = 'Erreur technique';
  public readonly code = ErrorCode.INVALID_TOKEN_CHECKSUM_EXCEPTION;
}
