import { IsEmail, IsOptional, IsString } from 'class-validator';

/**
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.5.1
 */
export class OidcIdentityDto {
  @IsString()
  @IsOptional()
  sub?: string;

  @IsString()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  given_name: string;

  @IsString()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  family_name: string;

  @IsString()
  birthdate: string;

  @IsString()
  gender: string;

  @IsString()
  birthplace: string;

  @IsString()
  birthcountry: string;

  @IsString()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  preferred_username?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  phone_number?: string;
}
