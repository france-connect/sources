/* istanbul ignore file */

// Declarative file
import { BaseException } from './base.exception';

export class UnknownException extends BaseException {
  static DOCUMENTATION =
    'Erreur inconnue du système, ne devrait pas se produire, prévenir SN3.';
  static SCOPE = 0;
  static CODE = 0;
  static UI = 'exceptions.default_message';
}
