import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class FraudCaseDto {
  @IsUUID(4)
  fraudCaseId: string;

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
}
