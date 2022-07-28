/* istanbul ignore file */

// Declarative code
import { IsObject } from 'class-validator';

/**
 * @todo Temporary config for missing idpLabel
 * please remove this code in 6 month.
 * Author: Arnaud PSA
 * Date: 21/04/2022
 */
export class IdpMappings {
  @IsObject()
  readonly mappings: Record<string, string>;
}
