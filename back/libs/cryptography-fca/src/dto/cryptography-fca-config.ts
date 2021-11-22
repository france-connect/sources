/* istanbul ignore file */

// Declarative code
import { IsAscii, IsOptional, MinLength } from 'class-validator';

export class CryptographyFcaConfig {
  @IsAscii()
  @MinLength(8)
  @IsOptional()
  readonly subSecretKey: string;

  @IsAscii()
  @MinLength(8)
  @IsOptional()
  readonly hashSecretKey: string;
}
