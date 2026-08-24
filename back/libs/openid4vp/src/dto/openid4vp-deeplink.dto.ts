import { Expose } from 'class-transformer';
import { Equals, IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';

import { FunctionSafe } from '@fc/common';

import { Openid4vpResponseType } from '../enums';

export class Openid4vpDeepLinkDto {
  @Equals('openid4vp:')
  readonly protocol: 'openid4vp:';

  @IsString()
  @IsNotEmpty()
  readonly clientId: string;

  @IsUrl({
    protocols: ['https'],
    // Class-validator rule name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    require_protocol: true,
  })
  @IsNotEmpty()
  readonly requestUri: string;

  @IsEnum(Openid4vpResponseType)
  readonly responseType: Openid4vpResponseType;

  @Expose()
  readonly toString: FunctionSafe;
}
