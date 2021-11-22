/* istanbul ignore file */

// Declarative code
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { EidasCountries } from '@fc/eidas-country';

import {
  EidasAttributes,
  EidasLevelOfAssurances,
  EidasNameIdFormats,
  EidasSpTypes,
} from '../enums';

export class EidasRequest {
  @IsString()
  @IsEnum(EidasCountries)
  citizenCountryCode: EidasCountries;

  @IsString()
  @MinLength(1)
  id: string;

  @IsString()
  @MinLength(1)
  issuer: string;

  @IsString()
  @IsEnum(EidasLevelOfAssurances)
  levelOfAssurance: EidasLevelOfAssurances;

  @IsString()
  @IsEnum(EidasNameIdFormats)
  nameIdFormat: EidasNameIdFormats;

  @IsString()
  @MinLength(1)
  providerName: string;

  @IsString()
  @IsEnum(EidasSpTypes)
  spType: EidasSpTypes;

  @IsOptional()
  @IsString()
  @MinLength(1)
  relayState: string;

  @IsArray()
  @IsEnum(EidasAttributes, { each: true })
  requestedAttributes: EidasAttributes[];
}
