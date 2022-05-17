/* istanbul ignore file */

// Declarative code

/**
 * Note that we do not do any runtime validation with class validator on this DTO
 * This DTO is supposed to be build statically, so it would not make sense.
 */
import { IsArray, IsObject } from 'class-validator';

import { IProviderMappings } from '../interfaces';

export class ScopesConfig {
  @IsArray()
  @IsObject({ each: true })
  mapping: IProviderMappings[];
}
