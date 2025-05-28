import { Type } from 'class-transformer';
import {
  IsEnum,
  IsObject,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

import { FSA, FSAMeta } from '@fc/common';

import { ActionTypes } from '../enums';

export class ProxyUrlWhiteList {
  @IsUrl({}, { each: true })
  readonly urls: string[];
}

export class ProxyMeta implements FSAMeta {
  @IsString()
  readonly spId: string;

  [key: string]: unknown;
}

export class CsmrProxyClientMessageDto implements FSA<ProxyMeta> {
  @IsEnum(ActionTypes)
  readonly type: ActionTypes;

  @IsObject()
  @Type(() => ProxyUrlWhiteList)
  @ValidateNested()
  readonly payload: ProxyUrlWhiteList;

  @IsObject()
  @Type(() => ProxyMeta)
  @ValidateNested()
  readonly meta?: ProxyMeta;
}
