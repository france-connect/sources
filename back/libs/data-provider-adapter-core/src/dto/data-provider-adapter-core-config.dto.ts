/* istanbul ignore file */

// Declarative code
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class DataProviderAdapterCoreConfig {
  @IsString()
  @IsNotEmpty()
  // Based on oidc standard
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_id: string;

  @IsString()
  @IsNotEmpty()
  // Based on oidc standard
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_secret: string;

  @IsUrl()
  checktokenEndpoint: string;
}
