/* istanbul ignore file */

// declarative code
import { Description, FcException } from '@fc/exceptions';

import { ErrorCode } from '../enums';

@Description(
  "Problème de connexion entre le bridge eidas et le noeud eidas contacter le SN3 (Le LightToken dépasse la taille maximum autorisée pour son traitement. Possiblement une erreur dans le format ou une tentative d'attaque.)",
)
export class EidasOversizedTokenException extends FcException {
  message = 'Erreur technique';
  public readonly code = ErrorCode.OVERSIZED_TOKEN_EXCEPTION;
}
