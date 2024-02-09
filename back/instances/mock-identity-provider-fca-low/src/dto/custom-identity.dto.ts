import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { MinimalCustomIdentityInterface } from '@fc/mock-identity-provider';

export class CustomIdentityDto implements MinimalCustomIdentityInterface {
  @IsString()
  @IsNotEmpty()
  // OIDC naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly given_name: string;

  @IsString()
  @IsNotEmpty()
  // OIDC style naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly usual_name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  uid: string;

  @IsString()
  @IsOptional()
  readonly siren?: string;

  @IsString()
  @IsOptional()
  readonly siret?: string;

  @IsString()
  @IsOptional()
  // OIDC style naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly organizational_unit?: string;

  @IsString()
  @IsOptional()
  // OIDC style naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly belonging_population?: string;

  @IsString()
  @IsOptional()
  // OIDC style naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly phone_number?: string;

  @IsString()
  @IsOptional()
  readonly chorusdt?: string;

  @IsString()
  @IsNotEmpty()
  readonly acr: string;
}
