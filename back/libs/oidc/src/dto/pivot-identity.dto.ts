/* istanbul ignore file */

// Declarative code
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

/**
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.5.1
 */
export class PivotIdentityDto {
  @IsString()
  @Expose()
  given_name: string;

  @IsString()
  @Expose()
  family_name: string;

  @IsString()
  @Expose()
  birthdate: string;

  @IsString()
  @Expose()
  gender: string;

  @IsString()
  @Expose()
  birthplace: string;

  @IsString()
  @Expose()
  birthcountry: string;
}
