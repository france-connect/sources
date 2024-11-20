/* istanbul ignore file */

// declarative code
import { ErrorCode } from '../enums';
import { EidasBaseException } from './eidas-base.exception';

export class EidasJsonToXmlException extends EidasBaseException {
  static CODE = ErrorCode.JSON_TO_XML_EXCEPTION;
  static DOCUMENTATION =
    "Problème de connexion entre le bridge eIDAS et le noeud eIDAS; contacter le service technique (Le JSON reçu n'a pas pu être converti en XML. La structure est invalide ou il manque des éléments essentiels.)";
  static UI = 'EidasLightProtocol.exceptions.eidasJsonToXml';
}
