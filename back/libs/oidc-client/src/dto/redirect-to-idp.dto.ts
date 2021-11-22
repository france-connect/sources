import { IsAscii, IsOptional, IsString } from 'class-validator';

export class RedirectToIdp {
  @IsString()
  @IsOptional()
  @IsAscii()
  readonly providerUid?: string;

  @IsString()
  @IsOptional()
  readonly scope?: string;

  @IsString()
  @IsOptional()
  readonly claims?: string;

  @IsString()
  @IsOptional()
  @IsAscii()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly acr_values?: string;

  @IsString()
  @IsAscii()
  @IsOptional()
  readonly csrfToken: string;
}
