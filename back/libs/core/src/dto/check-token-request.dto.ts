/* istanbul ignore file */

// Declarative code
import { IsNotEmpty, IsString } from 'class-validator';

export class ChecktokenRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly token: string;

  @IsString()
  @IsNotEmpty()
  readonly client_id: string;

  @IsString()
  @IsNotEmpty()
  readonly client_secret: string;
}
