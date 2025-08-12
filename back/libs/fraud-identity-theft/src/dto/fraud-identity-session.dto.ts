import { IsNotEmpty, IsString } from 'class-validator';

export class FraudIdentitySessionDto {
  @IsNotEmpty()
  @IsString()
  family_name: string;

  @IsNotEmpty()
  @IsString()
  given_name: string;

  @IsNotEmpty()
  @IsString()
  // Remove validation for birthdate format due to flexibility in input
  // requested at the PO review
  rawBirthdate: string;

  @IsNotEmpty()
  @IsString()
  rawBirthcountry: string;

  @IsNotEmpty()
  @IsString()
  rawBirthplace: string;
}
