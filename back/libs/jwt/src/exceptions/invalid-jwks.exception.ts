import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

export class InvalidJwksException extends JwtBaseException {
  static CODE = ErrorCode.INVALID_JWKS;
  static DOCUMENTATION =
    "Le format de la JWKS n'est pas valide. Il doit s'agir d'un tableau keys contenant des JWK avec les attributs 'use' et 'alg'.";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION = 'invalid JWKS format';
  static UI = 'Jwt.exceptions.invalidJwks';
}
