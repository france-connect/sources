/* istanbul ignore file */

// Declarative file
import { IsNotEmpty, IsString } from 'class-validator';

export class ExceptionsConfig {
  @IsString()
  @IsNotEmpty()
  readonly prefix: string;
}
