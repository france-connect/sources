/* istanbul ignore file */

// declarative code
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { IsStringOrRegExp } from '@fc/common';

import { ITemplateExposed } from '../interfaces';

export class CookieOptions {
  @IsBoolean()
  readonly signed: boolean;

  @IsString()
  @IsIn(['Strict', 'Lax', 'None'])
  readonly sameSite: 'Strict' | 'Lax' | 'None';

  @IsBoolean()
  readonly httpOnly: boolean;

  @IsBoolean()
  readonly secure: boolean;

  @IsNumber()
  @IsPositive()
  readonly maxAge: number;

  @IsString()
  readonly domain: string;
}

export class SessionConfig {
  /**
   * @TODO #151 evaluate the opportunity to use keyObjects
   * instead of plain string + rotation of keys
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/151
   */
  @IsString()
  @Length(32, 32)
  readonly encryptionKey: string;

  @IsString()
  @MinLength(2)
  readonly prefix: string;

  @ValidateNested()
  @Type(() => CookieOptions)
  readonly cookieOptions: CookieOptions;

  @IsString()
  readonly sessionCookieName: string;

  @IsArray()
  readonly cookieSecrets: string[];

  @IsNumber()
  @IsPositive()
  readonly lifetime: number;

  @IsNumber()
  @Min(32)
  readonly sessionIdLength: number;

  @IsArray()
  @IsStringOrRegExp({ each: true })
  readonly excludedRoutes: (string | RegExp)[];

  @IsObject()
  @IsOptional()
  readonly templateExposed?: ITemplateExposed;
}
