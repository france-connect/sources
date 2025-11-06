import { IsArray, IsEnum, IsObject } from 'class-validator';

import { FSA } from '@fc/common';
import { ResponseStatus } from '@fc/microservices-rmq';
import { MicroservicesRmqResponseInterface } from '@fc/microservices-rmq/interfaces';

import { FraudTrackDto } from './fraud-track.dto';

export class FraudTracksResponseDto
  implements MicroservicesRmqResponseInterface
{
  @IsEnum(ResponseStatus)
  readonly type: ResponseStatus;

  @IsObject()
  readonly meta: { message: FSA };

  @IsArray()
  @IsObject({ each: true })
  readonly payload: FraudTrackDto[];
}
