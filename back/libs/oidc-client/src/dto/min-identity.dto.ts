/* istanbul ignore file */

// Declarative code
import { Expose } from 'class-transformer';
import { IsAscii, MinLength } from 'class-validator';

export class MinIdentityDto {
  @MinLength(1)
  @IsAscii()
  @Expose()
  readonly sub!: string;
}

/**
 *  @todo
 *    author: Arnaud
 *    date: 17/03/2020
 *    ticket: FC-244 (identity, DTO, Eidas-bridge)
 *
 *    context: I want to check all basic data of every Idp
 *    problem: eIDAS bridge doesn't provide the following params
 *    action: eIDAS must returns the following params to conform other Idp:
 *    aud (hexadecimal), exp (date), iat (date), iss (url)
 */
