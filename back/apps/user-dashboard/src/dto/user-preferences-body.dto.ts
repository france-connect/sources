/* istanbul ignore file */

// Declarative code
import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsString } from 'class-validator';

import { enforceArray, enforceBoolean } from '@fc/common';

export class UserPreferencesBodyDto {
  @Transform(enforceArray)
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  idpList: string[];

  @Transform(enforceBoolean)
  @IsBoolean()
  allowFutureIdp: boolean;
}
