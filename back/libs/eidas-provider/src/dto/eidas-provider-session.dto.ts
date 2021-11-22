/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { EidasPartialResponse, EidasRequest } from '@fc/eidas';

export class EidasProviderSession {
  @IsObject()
  @ValidateNested()
  @Type(() => EidasRequest)
  readonly eidasRequest: EidasRequest;

  @IsObject()
  /**
   * Can't use "Partial" beacause of typescript reflection:
   * @see https://github.com/typestack/class-transformer#working-with-generics
   */
  readonly partialEidasResponse: EidasPartialResponse;
}
