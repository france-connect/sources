/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIP,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { EidasLevelOfAssurances, EidasNameIdFormats } from '../enums';
import {
  EidasResponseAttributes,
  EidasResponseStatus,
} from './eidas-response.dto';

export class EidasPartialResponseContext {
  @IsOptional()
  @IsString()
  @MinLength(1)
  id?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  relayState?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  issuer?: string;

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

  @IsOptional()
  @IsString()
  @MinLength(1)
  inResponseToId?: string;

  @IsOptional()
  @IsString()
  @IsEnum(EidasLevelOfAssurances)
  levelOfAssurance?: EidasLevelOfAssurances;
}

export class EidasPartialResponse extends EidasPartialResponseContext {
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
