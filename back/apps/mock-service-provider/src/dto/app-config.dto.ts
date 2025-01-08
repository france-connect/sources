import { Type } from 'class-transformer';
import {
  IsBoolean,
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

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly secret?: string;
}

export class AppConfig extends AppGenericConfig {
  @IsString()
  @IsNotEmpty()
  readonly idpId: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DataApi)
  readonly dataApis?: DataApi[];

  @IsOptional()
  @IsBoolean()
  readonly allowRevokeToken?: boolean;
}
