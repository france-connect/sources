import { IsString, MinLength } from 'class-validator';

export class RedirectToIdpSessionDto {
  @IsString()
  @MinLength(1)
  readonly interactionId: string;
}
