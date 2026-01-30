import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

import { AppConfig as AppGenericConfig } from '@fc/app';

export class AppConfig extends AppGenericConfig {
  @IsString()
  readonly platform: string;

  @IsString({ each: true })
  readonly sortedClaims: string[];

  @IsBoolean()
  showExcludedIdp: boolean;

  @IsString({ each: true })
  @IsArray()
  readonly assetsPaths: string[];

  @IsString()
  readonly assetsUrlPrefix: string;

  @IsNumber()
  @IsPositive()
  readonly assetsCacheTtl: number;
}
