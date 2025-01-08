import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { Environment } from '../enums';

class HttpsOptions {
  @IsString()
  @MinLength(1)
  @IsOptional()
  readonly key?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  readonly cert?: string;
}

class DsfrAssets {
  @IsString()
  readonly assetPath: string;

  @IsString()
  readonly prefix: string;
}

export class AppConfig {
  @IsString()
  readonly name: string;

  /**
   * @TODO #195
   * ETQ dev, je check le préfix d'url
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/195
   */
  @IsString()
  readonly urlPrefix: string;

  @ValidateNested()
  @Type(() => HttpsOptions)
  readonly httpsOptions: HttpsOptions;

  @IsOptional()
  @IsString()
  readonly fqdn?: string;

  @IsOptional()
  @IsString()
  readonly udFqdn?: string;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  readonly assetsPaths?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => DsfrAssets)
  readonly assetsDsfrPaths?: DsfrAssets[];

  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly assetsCacheTtl?: number;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  readonly viewsPaths?: string[];

  @IsOptional()
  @IsString()
  @IsIn(['Europe/Paris'])
  readonly timezone?: string;

  @IsOptional()
  @IsString()
  readonly minAcrForContextRequest?: string;

  @IsOptional()
  @IsString()
  eidasBridgeUid?: string;

  @IsOptional()
  @IsString()
  aidantsConnectUid?: string;

  @IsOptional()
  @IsEnum(Environment)
  environment?: Environment;
}
