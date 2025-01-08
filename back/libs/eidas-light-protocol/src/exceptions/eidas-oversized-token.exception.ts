import { ErrorCode } from '../enums';
import { EidasBaseException } from './eidas-base.exception';

export class EidasOversizedTokenException extends EidasBaseException {
  static CODE = ErrorCode.OVERSIZED_TOKEN_EXCEPTION;
  static DOCUMENTATION =
    "Problème de connexion entre le bridge eidas et le noeud eidas contacter le SN3 (Le LightToken dépasse la taille maximum autorisée pour son traitement. Possiblement une erreur dans le format ou une tentative d'attaque.)";
  static UI = 'EidasLightProtocol.exceptions.eidasOversizedToken';
}
