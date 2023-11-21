import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { AppConfig as AppGenericConfig } from '@fc/app';
import { EidasCountries } from '@fc/eidas-country';

export class AppConfig extends AppGenericConfig {
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Object.values(EidasCountries), { each: true })
  readonly countryIsoList: string[];

  @IsString()
  @IsNotEmpty()
  readonly idpId: string;
}
