/* istanbul ignore file */

// Declarative code
import { FcException } from '@fc/exceptions-deprecated';

export class GeoipMaxmindBaseException extends FcException {
  scope = 40;
}
