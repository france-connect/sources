import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { MinimalCustomIdentityInterface } from '@fc/mock-identity-provider';

export class CustomIdentityDto implements MinimalCustomIdentityInterface {
  @IsString()
  @IsNotEmpty()
  readonly given_name: string;

  @IsString()
  @IsNotEmpty()
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
  readonly organizational_unit?: string;

  @IsString()
  @IsOptional()
  readonly belonging_population?: string;

  @IsString()
  @IsOptional()
  readonly phone_number?: string;

  @IsString()
  @IsOptional()
  readonly chorusdt?: string;

  @IsString()
  @IsNotEmpty()
  readonly acr: string;
}
