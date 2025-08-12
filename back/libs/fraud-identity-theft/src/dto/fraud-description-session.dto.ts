import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class FraudDescriptionSessionDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  description: string;
}
