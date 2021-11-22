/* istanbul ignore file */

// Declarative code
import { IsEnum } from 'class-validator';

import { EidasCountries } from '@fc/eidas-country';

export class EidasClientValidateEuropeanIdentity {
  @IsEnum(EidasCountries)
  readonly country: EidasCountries;
}
