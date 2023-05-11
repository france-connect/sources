/* istanbul ignore file */

// Declarative code
import { IsArray, IsUUID } from 'class-validator';

export class CoreSessionDto {
  @IsArray()
  @IsUUID('4', { each: true })
  sentNotificationsForSp: string[]; // spId array for service providers
}
