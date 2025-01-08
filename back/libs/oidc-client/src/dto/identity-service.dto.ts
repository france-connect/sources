import {
  IsAlphanumeric,
  IsAscii,
  IsJWT,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { TokenResults } from '../interfaces';

export class TokenResultDto implements TokenResults {
  @IsString()
  @MinLength(1)
  @IsAscii()
  readonly accessToken: string;

  @IsString()
  @MinLength(1)
  @IsJWT()
  readonly idToken: string;

  @IsString()
  @MinLength(1)
  @IsAscii()
  @IsOptional()
  readonly refreshToken?: string;

  @IsString()
  @IsAlphanumeric()
  readonly acr: string;

  @IsString({ each: true })
  @IsOptional()
  readonly amr?: string[];

  @IsString({ each: true })
  @IsOptional()
  readonly idpRepresentativeScope?: string[];
}
