/* istanbul ignore file */

// Declarative code
import { IsString } from 'class-validator';

export class AppConfigDto {
  @IsString()
  readonly tz: string;
}
