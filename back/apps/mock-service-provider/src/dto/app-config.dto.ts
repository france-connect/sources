/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { AppConfig as AppGenericConfig } from '@fc/app';

export class DataApi {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly url: string;

  @IsString()
  @IsNotEmpty()
  readonly secret: string;
}

export class AppConfig extends AppGenericConfig {
  @IsString()
  @IsNotEmpty()
  readonly idpId: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DataApi)
  readonly dataApis?: DataApi[];
}
