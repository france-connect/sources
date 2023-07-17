/* istanbul ignore file */

// Declarative code
import { IsNotEmpty, IsString } from 'class-validator';

export class ChecktokenRequestDto {
  @IsString()
  @IsNotEmpty()
  // oidc like
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly access_token: string;

  @IsString()
  @IsNotEmpty()
  // oidc like
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_id: string;

  @IsString()
  @IsNotEmpty()
  // oidc like
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_secret: string;
}
