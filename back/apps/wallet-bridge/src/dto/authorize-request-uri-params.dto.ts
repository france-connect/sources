import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthorizeRequestUriParamsDto {
  @IsNotEmpty()
  @IsString()
  readonly interactionId: string;
}

export class AuthorizeRequestObjectParamsDto {
  @IsNotEmpty()
  @IsString()
  readonly interactionId: string;

  @IsString()
  @MinLength(32)
  readonly state: string;
}
