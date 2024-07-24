import {
  IsArray,
  IsEnum,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

import { IsCog } from '@fc/cog';

import { Genders } from '../enums';
import { IsRnippBirthdate } from '../validators';

const COG_FRANCE = '99100';

export class RnippPivotIdentity {
  @IsString()
  @IsEnum(Genders)
  readonly gender: string;

  @IsString()
  @MinLength(1)
  readonly family_name: string;

  @IsString()
  @MinLength(1)
  readonly given_name: string;

  @IsString({ each: true })
  @IsArray()
  readonly given_name_array: string[];

  @IsString()
  @IsRnippBirthdate()
  readonly birthdate: string;

  @ValidateIf(RnippPivotIdentity.shouldValidateBirthplace)
  @IsString()
  @IsCog()
  readonly birthplace: string;

  @IsString()
  @IsCog()
  readonly birthcountry: string;

  static shouldValidateBirthplace(instance: RnippPivotIdentity) {
    return instance.birthcountry === COG_FRANCE;
  }
}
