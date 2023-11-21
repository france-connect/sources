/* istanbul ignore file */

// Declarative code
import { Expose } from 'class-transformer';
import { IsArray, IsUUID } from 'class-validator';

export class CoreSessionDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @Expose()
  sentNotificationsForSp: string[]; // spId array for service providers
}
