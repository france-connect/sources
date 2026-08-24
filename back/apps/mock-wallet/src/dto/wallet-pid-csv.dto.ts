import { Expose, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateNested,
} from 'class-validator';

import { enforceBoolean, Split } from '@fc/common';
import { EidasCountries } from '@fc/eidas-country';
import {
  EudiGenders,
  EudiPidBirthPlaceDto,
  EudiPidBirthPlaceInterface,
} from '@fc/eudi';

export class WalletPidCsvDto {
  @Expose()
  @IsString()
  // EUDI style variable names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly test_case: string;

  @Expose()
  @IsString()
  readonly family_name: string;

  @Expose()
  @IsString()
  readonly given_name: string;

  @Expose()
  @IsString()
  readonly birth_date: string;

  @Transform(({ obj }) => WalletPidCsvDto.groupBirthPlace(obj))
  @Expose()
  @IsObject()
  @ValidateNested()
  @Type(() => EudiPidBirthPlaceDto)
  readonly birth_place: EudiPidBirthPlaceInterface;

  @IsString()
  @IsOptional()
  @Length(2, 2)
  readonly birth_country?: string;

  @IsString()
  @IsOptional()
  // EUDI style variable names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly birth_region?: string;

  @IsString()
  @IsOptional()
  // EUDI style variable names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly birth_locality?: string;

  @Expose()
  @IsEnum(EidasCountries, { each: true })
  @Split('|')
  readonly nationality: EidasCountries[];

  @Expose()
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  readonly age_birth_year?: number;

  @Expose()
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  readonly age_in_years?: number;

  @Expose()
  @IsString()
  @IsOptional()
  readonly family_name_birth?: string;

  @Expose()
  @IsEnum(EidasCountries)
  @IsOptional()
  readonly issuing_country?: EidasCountries;

  @Expose()
  @IsOptional()
  @IsObject()
  readonly portrait?: Record<string, unknown>;

  @Expose()
  @Transform(enforceBoolean)
  @IsBoolean()
  @IsOptional()
  readonly age_over_18?: boolean;

  @Expose()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  readonly expiry_date?: Date;

  @Expose()
  @IsOptional()
  @IsString()
  readonly issuing_authority?: string;

  @Expose()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsEnum(EudiGenders)
  readonly sex?: EudiGenders;

  @Expose()
  @IsUrl()
  @IsOptional()
  readonly trust_anchor?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly resident_address?: string;

  @Expose()
  @IsEnum(EidasCountries)
  @IsOptional()
  readonly resident_country?: EidasCountries;

  @Expose()
  @IsString()
  @IsOptional()
  readonly resident_state?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly resident_city?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly resident_postal_code?: string;

  @IsString()
  @Expose()
  @IsOptional()
  readonly resident_street?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly resident_house_number?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly personal_administrative_number?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly given_name_birth?: string;

  @Expose()
  @IsEmail()
  @IsOptional()
  readonly email_address?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly mobile_phone_number?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly issuance_date?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly document_number?: string;

  @Expose()
  @IsEnum(EidasCountries)
  @IsOptional()
  readonly issuing_jurisdiction?: EidasCountries;

  @Expose()
  @IsString()
  @IsOptional()
  readonly location_status?: string;

  static groupBirthPlace(
    obj: Pick<
      WalletPidCsvDto,
      'birth_country' | 'birth_region' | 'birth_locality'
    >,
  ) {
    return {
      country: obj.birth_country || undefined,
      region: obj.birth_region || undefined,
      locality: obj.birth_locality || undefined,
    };
  }
}
