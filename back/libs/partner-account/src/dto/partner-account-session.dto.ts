/* istanbul ignore file */

// Declarative code
import { IsString } from 'class-validator';

export class PartnerAccountSession {
  @IsString()
  readonly firstname: string;

  @IsString()
  readonly lastname: string;
}
