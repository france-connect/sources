import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  ValidateNested,
} from 'class-validator';

import { EidasCountries } from '@fc/eidas-country';
import { EudiGenders, EudiPidInterface } from '@fc/eudi';

export class EudiPidClaimsDto implements EudiPidInterface {
  @IsString()
  @Length(1, 256)
  readonly family_name: string;

  @IsString()
  @Length(1, 256)
  readonly given_name: string;

  @IsString()
  @Length(10, 30)
  @Transform(({ value }) => value.toString())
  readonly birth_date: string;

  @IsString()
  @Length(1, 256)
  readonly birth_place: string;

  @IsArray()
  @Length(2, 2, { each: true })
  @IsEnum(EidasCountries, { each: true })
  readonly nationality: EidasCountries[];

  @IsNumber()
  @Max(3000)
  @IsOptional()
  readonly age_birth_year?: number;

  @IsNumber()
  @IsOptional()
  @Max(999)
  readonly age_in_years?: number;

  @IsString()
  @IsOptional()
  @Length(1, 256)
  readonly family_name_birth?: string;

  @IsString()
  @IsOptional()
  @Length(2, 2)
  @IsEnum(EidasCountries)
  readonly issuing_country?: EidasCountries;

  @IsObject()
  @IsOptional()
  readonly portrait?: object;

  @IsBoolean()
  @IsOptional()
  readonly age_over_18?: boolean;

  @IsDate()
  @IsOptional()
  readonly expiry_date?: Date;

  @IsString()
  @IsOptional()
  @Length(1, 256)
  readonly issuing_authority?: string;

  @IsEnum(EudiGenders)
  @IsOptional()
  readonly sex?: EudiGenders;

  @IsUrl()
  @IsOptional()
  @Length(10, 256)
  readonly trust_anchor?: string;

  @IsString()
  @IsOptional()
  @Length(2, 2)
  @IsEnum(EidasCountries)
  readonly birth_country?: string;

  @IsString()
  @IsOptional()
  @Length(1, 256)
  readonly resident_address?: string;

  @IsString()
  @IsOptional()
  @Length(1, 256)
  @IsEnum(EidasCountries)
  readonly resident_country?: EidasCountries;

  @IsString()
  @IsOptional()
  @Length(1, 256)
  readonly resident_state?: string;

  @IsString()
  @IsOptional()
  @Length(1, 256)
  readonly resident_city?: string;

  @IsString()
  @IsOptional()
  @Length(1, 256)
  readonly resident_postal_code?: string;

  @IsString()
  @IsOptional()
  @Length(1, 256)
  readonly resident_street?: string;

  @IsString()
  @IsOptional()
  @Length(1, 256)
  readonly resident_house_number?: string;

  @IsString()
  @IsOptional()
  @Length(1, 256)
  readonly personal_administrative_number?: string;

  @IsString()
  @IsOptional()
  @Length(1, 256)
  readonly given_name_birth?: string;

  @IsEmail()
  @IsOptional()
  @Length(1, 256)
  readonly email_address?: string;

  @IsString()
  @IsOptional()
  @Length(1, 20)
  readonly mobile_phone_number?: string;

  @IsString()
  @IsOptional()
  @Length(10, 30)
  readonly issuance_date?: string;

  @IsString()
  @IsOptional()
  @Length(1, 256)
  readonly document_number?: string;

  @IsString()
  @IsOptional()
  @Length(1, 256)
  @IsEnum(EidasCountries)
  readonly issuing_jurisdiction?: EidasCountries;

  @IsString()
  @IsOptional()
  @Length(1, 256)
  readonly location_status?: string;

  @IsString()
  @IsOptional()
  @Length(10, 30)
  readonly portrait_capture_date?: string;
}

export class PidNameSpaceDto {
  @ValidateNested()
  @Type(() => EudiPidClaimsDto)
  readonly 'eu.europa.ec.eudi.pid.1': EudiPidClaimsDto;
}

export class EudiPidDto {
  @IsObject()
  @ValidateNested()
  @Type(() => PidNameSpaceDto)
  readonly claims: PidNameSpaceDto;

  @IsString()
  @IsIn(['eu.europa.ec.eudi.pid.1'])
  readonly docType: 'eu.europa.ec.eudi.pid.1';
}
