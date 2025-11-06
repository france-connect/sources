import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { FSA } from '@fc/common';
import { ResponseStatus } from '@fc/microservices-rmq';
import { MicroservicesRmqResponseInterface } from '@fc/microservices-rmq/interfaces';

export class AuthenticationEventDto {
  @IsNumber()
  time: number;

  @IsString()
  platform: string;

  @IsString()
  idpName: string;

  @IsString()
  idpId: string;

  @IsString()
  spName: string;

  @IsString()
  spId: string;

  @IsString()
  accountId: string;

  @IsString()
  browsingSessionId: string;

  @IsString()
  interactionId: string;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsArray()
  ipAddress: string[];
}

export class TrackingDataDto {
  @IsString()
  fraudCaseId: string;

  @IsString()
  userAccountIdLow: string;

  @IsString()
  userAccountIdHigh: string;

  @IsString()
  fraudSurveyOrigin: string;

  @IsString()
  authenticationEventId: string;

  @IsNumber()
  totalEvents: number;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => AuthenticationEventDto)
  authenticationEvents?: AuthenticationEventDto[];
}

export class FraudCaseResponseDto implements MicroservicesRmqResponseInterface {
  @IsEnum(ResponseStatus)
  readonly type: ResponseStatus;

  @IsObject()
  readonly meta: { message: FSA };

  @IsObject()
  readonly payload: TrackingDataDto;
}
