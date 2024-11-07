/* istanbul ignore file */

// Declarative code
import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class FraudCaseDto {
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
