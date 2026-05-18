import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { IsSiret } from '@fc/common';

import { DatapassEidasLevels } from '../enums';

export class DatapassApiResponseDataDto {
  @IsString()
  @IsNotEmpty()
  readonly intitule: string;

  @IsString()
  @IsNotEmpty()
  readonly scopes: string;

  @IsEnum(DatapassEidasLevels)
  readonly france_connect_eidas: DatapassEidasLevels;

  @IsEmail()
  readonly contact_technique_email: string;

  @IsString()
  @IsNotEmpty()
  readonly contact_technique_given_name: string;

  @IsString()
  @IsNotEmpty()
  readonly contact_technique_family_name: string;

  @IsString()
  @IsNotEmpty()
  readonly contact_technique_phone_number: string;
}

export class DatapassApiResponseHabilitationDto {
  @IsInt()
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  readonly state: string;

  @IsString()
  @IsNotEmpty()
  readonly authorization_request_class: string;

  @IsBoolean()
  readonly revoked: boolean;
}

export class DatapassApiResponseUniteLegaleDto {
  @IsString()
  @IsOptional()
  readonly denominationUniteLegale?: string | null;
}

export class DatapassApiResponseEtablissementDto {
  @IsObject()
  @ValidateNested()
  @Type(() => DatapassApiResponseUniteLegaleDto)
  readonly uniteLegale: DatapassApiResponseUniteLegaleDto;
}

export class DatapassApiResponseInseePayloadDto {
  @IsObject()
  @ValidateNested()
  @Type(() => DatapassApiResponseEtablissementDto)
  readonly etablissement: DatapassApiResponseEtablissementDto;
}

export class DatapassApiResponseOrganisationDto {
  @IsInt()
  readonly id: number;

  @IsSiret()
  readonly siret: string;

  @IsObject()
  @ValidateNested()
  @Type(() => DatapassApiResponseInseePayloadDto)
  readonly insee_payload: DatapassApiResponseInseePayloadDto;
}

export class DatapassApiResponseApplicantDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly given_name: string;

  @IsString()
  @IsNotEmpty()
  readonly family_name: string;
}

export class DatapassApiResponseDto {
  @IsInt()
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  readonly public_id: string;

  @IsString()
  @IsNotEmpty()
  readonly state: string;

  @IsString()
  @IsNotEmpty()
  readonly form_uid: string;

  @IsString()
  @IsNotEmpty()
  readonly last_validated_at: string;

  @IsObject()
  @ValidateNested()
  @Type(() => DatapassApiResponseDataDto)
  readonly data: DatapassApiResponseDataDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DatapassApiResponseHabilitationDto)
  readonly habilitations: DatapassApiResponseHabilitationDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => DatapassApiResponseOrganisationDto)
  readonly organisation: DatapassApiResponseOrganisationDto;

  @IsObject()
  @ValidateNested()
  @Type(() => DatapassApiResponseApplicantDto)
  readonly applicant: DatapassApiResponseApplicantDto;
}
