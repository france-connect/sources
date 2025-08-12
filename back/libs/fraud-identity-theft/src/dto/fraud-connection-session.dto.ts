import { IsNotEmpty, IsUUID } from 'class-validator';

export class FraudConnectionSessionDto {
  @IsNotEmpty()
  @IsUUID(4)
  code: string;
}
