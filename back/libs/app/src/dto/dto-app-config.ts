/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { ApiContentType } from '../enums';

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
  @IsString({ each: true })
  @IsArray()
  readonly assetsPaths?: string[];

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  readonly viewsPaths?: string[];

  @IsIn([ApiContentType.HTML, ApiContentType.JSON])
  readonly apiOutputContentType: string;
}
