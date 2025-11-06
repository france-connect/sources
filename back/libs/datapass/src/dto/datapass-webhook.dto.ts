import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

import { IsSiret } from '@fc/common';

import { DatapassEvents } from '../enums';
import { DatapassPayloadInterface } from '../interfaces';

export class OrganizationDto {
  @IsInt()
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsSiret()
  readonly siret: string;
}

export class ApplicantDto {
  @IsInt()
  readonly id: number;

  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly given_name: string;

  @IsString()
  @IsNotEmpty()
  readonly family_name: string;

  @IsString()
  @IsNotEmpty()
  readonly phone_number: string;

  @IsString()
  @IsNotEmpty()
  readonly job_title: string;
}

export class TechnicalContactDto {
  @IsString()
  @IsNotEmpty()
  readonly contact_technique_given_name: string;

  @IsString()
  @IsNotEmpty()
  readonly contact_technique_family_name: string;

  @IsString()
  @IsNotEmpty()
  readonly contact_technique_phone_number: string;

  @IsString()
  @IsNotEmpty()
  readonly contact_technique_job_title: string;

  @IsEmail()
  readonly contact_technique_email: string;
}

export class DatapassDataDto extends TechnicalContactDto {
  @IsString()
  @IsNotEmpty()
  readonly intitule: string;

  @IsArray()
  @IsString({ each: true })
  readonly scopes: string[];
}

export class DatapassPayloadDataDto {
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

  @IsObject()
  @ValidateNested()
  @Type(() => OrganizationDto)
  readonly organization: OrganizationDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ApplicantDto)
  readonly applicant: ApplicantDto;

  @IsObject()
  @ValidateNested()
  @Type(() => DatapassDataDto)
  readonly data: DatapassDataDto;
}

/**
 * Datapass payload validation
 * @see https://github.com/etalab/data_pass/blob/develop/docs/webhooks.md
 */
export class DatapassWebhookPayloadDto implements DatapassPayloadInterface {
  @IsEnum(DatapassEvents)
  readonly event: DatapassEvents;

  @IsInt()
  readonly fired_at: number;

  @IsString()
  @IsNotEmpty()
  readonly model_type: string;

  @IsObject()
  @ValidateNested()
  @Type(() => DatapassPayloadDataDto)
  readonly data: DatapassPayloadDataDto;
}
