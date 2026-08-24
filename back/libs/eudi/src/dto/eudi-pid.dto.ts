import { Expose, Transform, Type } from 'class-transformer';
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
  Matches,
  Max,
  ValidateNested,
} from 'class-validator';

import { RequireAtLeastOneOf } from '@fc/common';
import { EidasCountries } from '@fc/eidas-country';

import { EudiGenders } from '../enums';
import { EudiPidBirthPlaceInterface, EudiPidInterface } from '../interfaces';

export class EudiPidBirthPlaceDto implements EudiPidBirthPlaceInterface {
  @IsString()
  @IsOptional()
  @Expose()
  @Length(2, 2)
  @Matches(/^[A-Z]{2}$/)
  readonly country?: string;

  @IsString()
  @IsOptional()
  @Expose()
  @Length(1, 150)
  readonly region?: string;

  @IsString()
  @IsOptional()
  @Expose()
  @Length(1, 150)
  readonly locality?: string;
}

export class EudiPidClaimsDto implements EudiPidInterface {
  @IsString()
  @Length(1, 150)
  readonly family_name: string;

  @IsString()
  @Length(1, 150)
  readonly given_name: string;

  @IsString()
  @Length(10, 30)
  @Transform(({ value }) => value.toString())
  readonly birth_date: string;

  @RequireAtLeastOneOf(['country', 'region', 'locality'])
  @IsObject()
  @ValidateNested()
  @Type(() => EudiPidBirthPlaceDto)
  readonly birth_place: EudiPidBirthPlaceInterface;

  @IsArray()
  @IsOptional()
  @Length(2, 2, { each: true })
  @IsEnum(EidasCountries, { each: true })
  readonly nationality?: EidasCountries[];

  @IsNumber()
  @IsOptional()
  @Max(3000)
  readonly age_birth_year?: number;

  @IsNumber()
  @IsOptional()
  @Max(999)
  readonly age_in_years?: number;

  @IsString()
  @IsOptional()
  @Length(1, 150)
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
  @Length(1, 150)
  readonly issuing_authority?: string;

  @IsEnum(EudiGenders)
  @IsOptional()
  readonly sex?: EudiGenders;

  @IsUrl()
  @IsOptional()
  @Length(10, 150)
  readonly trust_anchor?: string;

  @IsString()
  @IsOptional()
  @Length(1, 150)
  readonly resident_address?: string;

  @IsString()
  @IsOptional()
  @Length(1, 150)
  @IsEnum(EidasCountries)
  readonly resident_country?: EidasCountries;

  @IsString()
  @IsOptional()
  @Length(1, 150)
  readonly resident_state?: string;

  @IsString()
  @IsOptional()
  @Length(1, 150)
  readonly resident_city?: string;

  @IsString()
  @IsOptional()
  @Length(1, 150)
  readonly resident_postal_code?: string;

  @IsString()
  @IsOptional()
  @Length(1, 150)
  readonly resident_street?: string;

  @IsString()
  @IsOptional()
  @Length(1, 150)
  readonly resident_house_number?: string;

  @IsString()
  @IsOptional()
  @Length(1, 150)
  readonly personal_administrative_number?: string;

  @IsString()
  @IsOptional()
  @Length(1, 150)
  readonly given_name_birth?: string;

  @IsEmail()
  @IsOptional()
  @Length(1, 150)
  readonly email_address?: string;

  @IsString()
  @IsOptional()
  @Length(1, 150)
  readonly mobile_phone_number?: string;

  @IsString()
  @IsOptional()
  @Length(10, 30)
  readonly issuance_date?: string;

  @IsString()
  @IsOptional()
  @Length(1, 150)
  readonly document_number?: string;

  @IsString()
  @IsOptional()
  @Length(1, 150)
  @IsEnum(EidasCountries)
  readonly issuing_jurisdiction?: EidasCountries;

  @IsString()
  @IsOptional()
  @Length(1, 150)
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
