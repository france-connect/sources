import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

import { Openid4vpAuthorizationError } from '@fc/openid4vp';

export class AuthorizeResponseBodyDto implements Record<string, unknown> {
  @IsString()
  @MinLength(32)
  readonly state: string;

  @ValidateIf(AuthorizeResponseBodyDto.hasNoError)
  @IsString()
  @IsNotEmpty()
  readonly response?: string;

  @IsEnum(Openid4vpAuthorizationError)
  @IsOptional()
  readonly error?: Openid4vpAuthorizationError;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  readonly error_description?: string;

  [key: string]: unknown;

  static hasNoError(body: AuthorizeResponseBodyDto): boolean {
    return !body.error;
  }
}
