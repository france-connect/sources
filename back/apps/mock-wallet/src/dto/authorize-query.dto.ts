import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';

import { Openid4vpDeepLinkInterface } from '@fc/openid4vp/interfaces';
import { openId4vpDeepLink } from '@fc/openid4vp/transforms';
import { IsOpenid4vpDeepLink } from '@fc/openid4vp/validators';

import { Flows } from '../enums';

export class AuthorizeQueryDto {
  @IsOpenid4vpDeepLink()
  @Transform(openId4vpDeepLink)
  @IsNotEmpty()
  readonly deepLink: Openid4vpDeepLinkInterface;

  @Min(0)
  @IsInt()
  @Type(() => Number)
  readonly identityIndex: number;

  @IsEnum(Flows)
  readonly flow: Flows;
}
