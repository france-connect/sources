/* istanbul ignore file */

// declarative code
import { IsNotEmpty, IsString } from 'class-validator';

export class LoggerConfig {
  @IsString()
  @IsNotEmpty()
  readonly path: string;
}
