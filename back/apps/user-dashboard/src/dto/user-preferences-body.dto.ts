import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsUUID } from 'class-validator';

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
}
