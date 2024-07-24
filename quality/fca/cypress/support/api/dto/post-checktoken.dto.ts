import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class ValidTokenIntrospection {
  @IsBoolean()
  readonly active: boolean;

  @IsString()
  @MinLength(1)
  readonly aud: string;

  @IsString()
  @MinLength(1)
  readonly sub: string;

  @IsNumber()
  @IsPositive()
  readonly iat: number;

  @IsNumber()
  @IsPositive()
  readonly exp: number;

  @IsString()
  @MinLength(1)
  readonly acr: string;

  @IsString()
  @MinLength(1)
  readonly jti: string;

  @IsString()
  readonly scope: string;
}

class ExpiredTokenIntrospection {
  @IsBoolean()
  readonly active: boolean;
}

export class PostChecktokenValidTokenDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ValidTokenIntrospection)
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly token_introspection: ValidTokenIntrospection;

  @IsString()
  @MinLength(1)
  readonly aud: string;

  @IsNumber()
  @IsPositive()
  readonly iat: number;

  @IsString()
  @MinLength(1)
  readonly iss: string;
}

export class PostChecktokenExpiredTokenDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ExpiredTokenIntrospection)
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly token_introspection: ExpiredTokenIntrospection;

  @IsString()
  @MinLength(1)
  readonly aud: string;

  @IsNumber()
  @IsPositive()
  readonly iat: number;

  @IsString()
  @MinLength(1)
  readonly iss: string;
}
