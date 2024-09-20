/* istanbul ignore file */

// Declarative code
import { IsString, IsUUID } from 'class-validator';

export class ConnectNotificationEmailParameters {
  @IsString()
  readonly idpTitle: string;

  @IsString()
  readonly spName: string;

  @IsString()
  readonly today: string;

  @IsString()
  readonly fqdn: string;

  @IsString()
  readonly udFqdn: string;

  @IsUUID(4)
  readonly browsingSessionId: string;
}
