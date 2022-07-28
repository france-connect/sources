/* istanbul ignore file */

// Declarative code
import { IsString, MinLength } from 'class-validator';

export class AppConfig {
  @IsString()
  /**
   * @todo Change to UUID('4') after verifying that the value is a valid UUID in fixtures
   */
  @MinLength(1)
  readonly aidantsConnectUid: string;
}
