import { IsEmail, IsOptional, IsString } from 'class-validator';

import { PivotIdentityDto } from './pivot-identity.dto';

/**
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.5.1
 */
export class OidcIdentityDto extends PivotIdentityDto {
  @IsString()
  @IsOptional()
  sub?: string;

  @IsString()
  @IsOptional()
  preferred_username?: string;

  @IsEmail()
  email: string;
}
