/* istanbul ignore file */

// Declarative code
import { IsBoolean, IsString, IsUUID, MinLength } from 'class-validator';

export class DataProviderAdapterMongoDTO {
  @IsUUID('4')
  readonly uid: string;

  @IsBoolean()
  readonly active: boolean;

  @IsString()
  readonly title: string;

  @IsString()
  @MinLength(32)
  // oidc like
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_id: string;

  @IsString()
  @MinLength(32)
  // oidc like
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_secret: string;
}
