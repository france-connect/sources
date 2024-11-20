/* istanbul ignore file */

// declarative code
import { ErrorCode } from '../enums';
import { EidasBaseException } from './eidas-base.exception';

export class EidasInvalidTokenChecksumException extends EidasBaseException {
  static CODE = ErrorCode.INVALID_TOKEN_CHECKSUM_EXCEPTION;
  static DOCUMENTATION =
    'Problème de connexion entre le bridge eIDAS et le noeud eIDAS; contacter le service technique (La somme de contrôle du LightToken reçu est invalide. Le token a possiblement été altéré.';
  static UI = 'EidasLightProtocol.exceptions.eidasInvalidTokenChecksum';
}
