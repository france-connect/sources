/* istanbul ignore file */

// Declarative code
import { FcException } from '@fc/exceptions';

export class GeoipMaxmindBaseException extends FcException {
  scope = 40;
}
