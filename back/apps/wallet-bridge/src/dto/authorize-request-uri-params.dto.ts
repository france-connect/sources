import { IsNotEmpty, IsString } from 'class-validator';

export class AuthorizeRequestUriParamsDto {
  @IsNotEmpty()
  @IsString()
  readonly interactionId: string;
}
