/* istanbul ignore file */

// Declarative code
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsString,
  IsUUID,
} from 'class-validator';

import { enforceArray, enforceBoolean } from '@fc/common';

export class UserPreferencesBodyDto {
  @Transform(enforceArray)
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  idpList: string[];

  @Transform(enforceBoolean)
  @IsBoolean()
  allowFutureIdp: boolean;

  @IsString()
  csrfToken: string;
}
