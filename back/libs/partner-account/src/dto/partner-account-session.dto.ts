/* istanbul ignore file */

// Declarative code
import { IsDate, IsString, IsUUID } from 'class-validator';

export class PartnerAccountSession {
  @IsUUID('4')
  readonly id: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly firstname: string;

  @IsString()
  readonly lastname: string;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  readonly updatedAt: Date;
}
