/* istanbul ignore file */

// Declarative code
import { IsString } from 'class-validator';

export class ConnectNotificationEmailParameters {
  @IsString()
  readonly idpTitle: string;

  @IsString()
  readonly spName: string;

  @IsString()
  readonly today: string;

  @IsString()
  readonly fqdn: string;
}
