/* istanbul ignore file */

// Declarative code
import { IsOptional, IsString, Length } from 'class-validator';

export class CsrfSession {
  @IsOptional()
  @IsString()
  @Length(64, 64)
  readonly csrfToken?: string;
}
