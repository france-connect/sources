import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FraudContactSessionDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  // Remove validation for phone number format due to flexibility in input
  // requested at the PO review
  @IsOptional()
  phone?: string;
}
