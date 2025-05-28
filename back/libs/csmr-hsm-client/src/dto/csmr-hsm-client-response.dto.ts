import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

import { FSA } from '@fc/common';
import { ResponseStatus } from '@fc/microservices-rmq';

export class CsmrHsmClientResponseDto {
  @IsEnum(ResponseStatus)
  readonly type: ResponseStatus;

  @IsString()
  readonly payload: string;

  @IsOptional()
  @IsObject()
  readonly meta?: { message: FSA };
}
