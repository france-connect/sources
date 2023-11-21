/* istanbul ignore file */

// Declarative code
import { IsString } from 'class-validator';

export class SignInDTO {
  @IsString()
  interactionId: string;

  @IsString()
  login: string;

  @IsString()
  password: string;

  @IsString()
  acr: string;
}
