import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsAscii, IsBoolean } from 'class-validator';

import { enforceArray, enforceBoolean } from '@fc/common';

export class UserPreferencesBodyDto {
  @Transform(enforceArray)
  @IsArray()
  @ArrayMinSize(1)
  @IsAscii({ each: true })
  idpList: string[];

  @Transform(enforceBoolean)
  @IsBoolean()
  allowFutureIdp: boolean;
}
