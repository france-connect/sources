import { IsEnum, IsObject, IsOptional } from 'class-validator';

import { FSA, FSAMeta } from '@fc/common';
import { ResponseStatus } from '@fc/microservices-rmq';

export class ConfigResponseDto implements FSA {
  @IsEnum(ResponseStatus)
  readonly type: ResponseStatus;

  @IsOptional()
  meta?: FSAMeta;

  @IsObject()
  @IsOptional()
  readonly payload?: unknown;
}
