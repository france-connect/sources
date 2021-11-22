import { IsEnum } from 'class-validator';

import { EidasCountries } from '@fc/eidas-country';

export class EidasBridgeValidateEuropeanIdentity {
  @IsEnum(EidasCountries)
  readonly country: string;
}
