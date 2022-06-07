/* istanbul ignore file */

// Declarative code
import { IsEmail, IsString } from 'class-validator';

export class LoginCredentials {
  @IsEmail()
  email: string;

  @IsString()
  password?: string;
}
