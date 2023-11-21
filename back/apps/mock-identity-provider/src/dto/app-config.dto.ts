import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

import { AppConfig as AppGenericConfig } from '@fc/app';

export class AppConfig extends AppGenericConfig {
  @IsString()
  readonly citizenDatabasePath: string;

  @IsString()
  readonly scenariosDatabasePath: string;

  @IsBoolean()
  passwordVerification: boolean;

  @IsArray()
  @IsOptional()
  csvBooleanColumns?: string[];
}
