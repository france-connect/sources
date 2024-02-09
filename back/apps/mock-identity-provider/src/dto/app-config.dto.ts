/* istanbul ignore file */

// Declarative file
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type as Class } from '@nestjs/common';

import { AppConfig as AppGenericConfig } from '@fc/app';

class IdentityFormConfig {
  @IsString()
  readonly name: string;

  @IsString()
  readonly label: string;

  @IsBoolean()
  readonly mandatory: boolean;

  @IsString()
  readonly type: string;

  @IsArray()
  @IsOptional()
  readonly values?: { value: string; label: string }[];
}

export class AppConfig extends AppGenericConfig {
  @IsString()
  readonly citizenDatabasePath: string;

  @IsString()
  readonly scenariosDatabasePath: string;

  @IsBoolean()
  readonly passwordVerification: boolean;

  @IsArray()
  @IsOptional()
  readonly csvBooleanColumns?: string[];

  @IsString()
  readonly logo: string;

  @IsString()
  readonly title: string;

  @IsObject({ each: true })
  @Type(() => IdentityFormConfig)
  @ValidateNested({ each: true })
  readonly identityForm: IdentityFormConfig[];

  @IsBoolean()
  readonly allowCustomIdentity: boolean;

  @IsDefined()
  readonly identityDto?: Class<unknown>;
}
