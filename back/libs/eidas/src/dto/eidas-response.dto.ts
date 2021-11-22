/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIP,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

import {
  EidasLevelOfAssurances,
  EidasNameIdFormats,
  EidasStatusCodes,
  EidasSubStatusCodes,
} from '../enums';

export class EidasResponseAddress {
  @IsOptional()
  @IsString()
  @MinLength(1)
  addressId?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  adminunitFirstline?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  adminunitSecondline?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  cvaddressArea?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  locatorDesignator?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  locatorName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  poBox?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  postCode?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  postName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  thoroughfare?: string;
}

export class EidasResponseAttributes {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  personIdentifier?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  currentFamilyName?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  currentGivenName?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  dateOfBirth?: string[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => EidasResponseAddress)
  currentAddress?: EidasResponseAddress;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  gender?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  birthName?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  placeOfBirth?: string[];
}

export class EidasResponseStatus {
  @IsBoolean()
  failure: boolean;

  @IsOptional()
  @IsString()
  @IsEnum(EidasStatusCodes)
  statusCode?: EidasStatusCodes;

  @IsOptional()
  @IsString()
  @MinLength(1)
  statusMessage?: string;

  @IsOptional()
  @IsString()
  @IsEnum(EidasSubStatusCodes)
  subStatusCode?: EidasSubStatusCodes;
}

export class EidasResponseContext {
  @IsString()
  @MinLength(1)
  id: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  relayState?: string;

  @IsString()
  @MinLength(1)
  issuer: string;

  @IsOptional()
  @IsString()
  @IsIP()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  subject?: string;

  @IsOptional()
  @IsString()
  @IsEnum(EidasNameIdFormats)
  subjectNameIdFormat?: EidasNameIdFormats;

  @IsString()
  @MinLength(1)
  inResponseToId: string;

  @IsOptional()
  @IsString()
  @IsEnum(EidasLevelOfAssurances)
  levelOfAssurance?: EidasLevelOfAssurances;
}

export class EidasResponse extends EidasResponseContext {
  @IsObject()
  @ValidateNested()
  @Type(() => EidasResponseStatus)
  status: EidasResponseStatus;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => EidasResponseAttributes)
  attributes?: EidasResponseAttributes;
}
