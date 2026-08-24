import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Openid4vpAuthorizationError } from '@fc/openid4vp/enums';
import { Openid4vpDeepLinkInterface } from '@fc/openid4vp/interfaces';
import { openId4vpDeepLink } from '@fc/openid4vp/transforms';
import { IsOpenid4vpDeepLink } from '@fc/openid4vp/validators';

import { Flows } from '../enums';

export class AuthorizeErrorQueryDto {
  @IsOpenid4vpDeepLink()
  @Transform(openId4vpDeepLink)
  @IsNotEmpty()
  readonly deepLink: Openid4vpDeepLinkInterface;

  @IsEnum(Flows)
  readonly flow: Flows;

  @IsEnum(Openid4vpAuthorizationError)
  @IsOptional()
  readonly error?: Openid4vpAuthorizationError;

  @IsString()
  @IsOptional()
  readonly errorDescription?: string;
}
