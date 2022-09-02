/* istanbul ignore file */

// Declarative code
import { IsUUID, MinLength } from 'class-validator';

export class AppConfig {
  @IsUUID(4)
  @MinLength(1)
  readonly aidantsConnectUid: string;
}
