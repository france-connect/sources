/* istanbul ignore file */

// Declarative code
import { IsDate, IsString } from 'class-validator';

export class PartnerAccountSession {
  @IsString()
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
