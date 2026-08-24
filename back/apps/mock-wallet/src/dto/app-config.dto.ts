import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { AppConfig as AppGenericConfig } from '@fc/app';
import { JwksDto } from '@fc/jwt';
import { Openid4vpResponseMode } from '@fc/openid4vp/enums';

export class AppConfig extends AppGenericConfig {
  @IsString()
  readonly identitiesCsvPath: string;

  @IsArray()
  @IsString({ each: true })
  readonly allowedAlgs: string[];

  @IsArray()
  @IsEnum(Openid4vpResponseMode, { each: true })
  readonly allowedResponseModes: Openid4vpResponseMode[];

  @IsBoolean()
  readonly skipSignatureVerification: boolean;

  @IsBoolean()
  readonly permissiveContentType: boolean;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => JwksDto)
  readonly trustedJwks?: JwksDto;

  @IsInt()
  @Min(1)
  readonly httpTimeoutMs: number;

  @IsString()
  readonly responseContentType: string;
}
