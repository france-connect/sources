import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { FraudTrackDto } from './fraud-track.dto';

export class FraudCaseDto {
  @IsUUID(4)
  id: string;

  @IsEmail()
  contactEmail: string;

  @IsEmail()
  idpEmail: string;

  @IsUUID(4)
  authenticationEventId: string;

  @IsString()
  fraudSurveyOrigin: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => FraudTrackDto)
  fraudTracks?: FraudTrackDto[];
}
