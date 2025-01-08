import { ErrorCode } from '../enums';
import { EidasBaseException } from './eidas-base.exception';

export class EidasXmlToJsonException extends EidasBaseException {
  static CODE = ErrorCode.XML_TO_JSON_EXCEPTION;
  static DOCUMENTATION =
    "Problème de connexion entre le bridge eidas et le noeud eidas contacter le SN3 (Le Xml reçu n'a pas pu être converti en Json. La structure est invalide ou il manque des éléments essentiels.)";
  static UI = 'EidasLightProtocol.exceptions.eidasXmlToJson';
}
