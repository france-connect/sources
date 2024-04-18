import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';

import { MinimalCustomIdentityInterface } from '@fc/mock-identity-provider';

export const noForeignBirthplaces = ({ obj }: TransformFnParams) => {
  if (obj.birthcountry && obj.birthcountry !== '99100') {
    return '';
  }

  return obj.birthplace;
};

export const defaultToFranceBirthcountry = ({ obj }: TransformFnParams) => {
  if (obj.birthcountry === '') {
    obj.birthcountry = '99100';
  }
  return obj.birthcountry;
};

export class CustomIdentityDto implements MinimalCustomIdentityInterface {
  @IsString()
  @IsNotEmpty()
  // OIDC naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly given_name: string;

  @IsString()
  @IsNotEmpty()
  // OIDC naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly family_name: string;

  @IsString()
  @IsOptional()
  // OIDC naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  preferred_username?: string;

  @IsIn(['female', 'male'])
  readonly gender: 'female' | 'male';

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsNotEmpty()
  readonly birthdate: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.birthcountry === '')
  @Transform(noForeignBirthplaces)
  readonly birthplace: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.birthplace === '')
  @Transform(defaultToFranceBirthcountry)
  readonly birthcountry: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly acr: string;

  @IsOptional()
  @IsString()
  // oidc like name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly rep_scope?: string;
}
