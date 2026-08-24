import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';

import { Openid4vpDeepLinkInterface } from '@fc/openid4vp/interfaces';
import { openId4vpDeepLink } from '@fc/openid4vp/transforms';
import { IsOpenid4vpDeepLink } from '@fc/openid4vp/validators';

import { Flows } from '../enums';

export class SelectIdentityQueryDto {
  @IsOpenid4vpDeepLink()
  @Transform(openId4vpDeepLink)
  readonly deepLink: Openid4vpDeepLinkInterface;

  @IsEnum(Flows)
  readonly flow: Flows;
}
