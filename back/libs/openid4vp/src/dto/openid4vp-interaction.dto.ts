import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { SimpleDocumentInterface } from '@fc/mdoc';

import {
  Openid4vpAuthorizationError,
  Openid4vpFlow,
  Openid4vpInteractionStatus,
} from '../enums';

export class Openid4vpStateDto {
  @IsString()
  @MinLength(32)
  readonly sameDevice: string;

  @IsString()
  @MinLength(32)
  readonly crossDevice: string;
}

export class Openid4vpInteractionDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly credentialQueryId: string;

  @ValidateNested()
  @Type(() => Openid4vpStateDto)
  readonly state: Openid4vpStateDto;

  @IsString()
  @MinLength(32)
  readonly nonce: string;

  @IsNumber()
  readonly iat: number;

  @IsNumber()
  readonly exp: number;

  @IsEnum(Openid4vpInteractionStatus)
  readonly status: Openid4vpInteractionStatus;

  @IsString()
  @IsNotEmpty()
  readonly sessionId: string;

  @IsEnum(Openid4vpFlow)
  @IsOptional()
  readonly flow?: Openid4vpFlow;

  @IsArray()
  @IsOptional()
  readonly response?: Array<SimpleDocumentInterface<unknown>>;

  @IsEnum(Openid4vpAuthorizationError)
  @IsOptional()
  readonly error?: Openid4vpAuthorizationError;

  @IsString()
  @IsOptional()
  readonly errorDescription?: string;
}
