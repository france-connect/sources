/* istanbul ignore file */

// declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { EidasBaseException } from './eidas-base-exception';

@Description(
  "Problème de connexion entre le bridge eIDAS et le noeud eIDAS; contacter le service technique (Le JSON reçu n'a pas pu être converti en XML. La structure est invalide ou il manque des éléments essentiels.)",
)
export class EidasJsonToXmlException extends EidasBaseException {
  public readonly code = ErrorCode.JSON_TO_XML_EXCEPTION;

  message = 'Erreur technique:: Conversion JSON vers XML impossible';

  constructor(error) {
    super(error);
    this.originalError = error;
    this.message = error.message;
  }
}
