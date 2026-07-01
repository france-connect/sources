import { IsUUID } from 'class-validator';

export class AuthorizeRequestUriParamsDto {
  @IsUUID('4')
  readonly interactionId: string;
}
