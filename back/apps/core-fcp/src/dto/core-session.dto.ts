/* istanbul ignore file */

// Declarative code
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CoreSession {
  @IsString({ each: true })
  @Expose()
  sentNotificationsForSp: string[]; // spId array for service providers
}
