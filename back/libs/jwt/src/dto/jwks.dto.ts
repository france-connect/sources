import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import { ArrayAtLeastOneItem } from '@fc/common';
import { KekAlg, Use } from '@fc/cryptography';

export class JwkDto {
  @IsEnum(KekAlg)
  readonly alg: KekAlg;

  @IsEnum(Use)
  readonly use: Use;

  @IsOptional()
  @IsString()
  readonly kid?: string;
}

export class JwksDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayAtLeastOneItem({
    message:
      "The JWKS doesn't contain a usable key with attributs 'use' and 'alg'",
  })
  @Type(() => JwkDto)
  readonly keys: JwkDto[];
}
