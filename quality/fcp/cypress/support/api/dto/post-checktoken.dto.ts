import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

const COG_FRANCE = '99100';

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

  @IsString()
  @MinLength(1)
  readonly gender: string;

  @IsString()
  @MinLength(1)
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly family_name: string;

  @IsString()
  @MinLength(1)
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly given_name: string;

  @IsString({ each: true })
  @IsArray()
  // variable name based on given_name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly given_name_array: string[];

  @IsString()
  @MinLength(1)
  readonly birthdate: string;

  @ValidateIf(ValidTokenIntrospection.shouldValidateBirthplace)
  @IsString()
  readonly birthplace: string;

  @IsString()
  @MinLength(1)
  readonly birthcountry: string;

  static shouldValidateBirthplace(instance: ValidTokenIntrospection): boolean {
    return instance.birthcountry === COG_FRANCE;
  }
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
