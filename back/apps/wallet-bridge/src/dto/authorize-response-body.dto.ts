import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthorizeResponseBodyDto implements Record<string, unknown> {
  @IsString()
  @MinLength(32)
  readonly state: string;

  @IsString()
  @IsNotEmpty()
  readonly response: string;

  [key: string]: unknown;
}
