import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { SimpleDocumentInterface } from '@fc/mdoc';

import { Openid4vpInteractionStatus } from '../enums';

export class Openid4vpInteractionDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly presentationId: string;

  @IsString()
  @MinLength(32)
  readonly state: string;

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

  @IsArray()
  @IsOptional()
  readonly response?: Array<SimpleDocumentInterface<unknown>>;
}
