import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class FraudTrackDto {
  @IsString()
  id: string;

  @IsNumber()
  time: number;

  @IsString()
  date: string;

  @IsString()
  platform: string;

  @IsString()
  idpName: string;

  @IsString()
  idpLabel: string;

  @IsString()
  idpId: string;

  @IsString()
  idpSub: string;

  @IsString()
  spName: string;

  @IsString()
  spId: string;

  @IsString()
  spSub: string;

  @IsString()
  accountId: string;

  @IsString()
  interactionAcr: string;

  @IsString()
  browsingSessionId: string;

  @IsString()
  interactionId: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsArray()
  ipAddress: string[];
}

export class SanitizedTrackDto {
  @IsString()
  trackId: string;

  @IsNumber()
  time: number;

  @IsString()
  platform: string;

  @IsString()
  idpLabel: string;

  @IsString()
  spLabel: string;

  @IsString()
  interactionAcr: string;

  @IsString()
  authenticationEventId: string;
}
