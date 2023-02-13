import { IsString, MinLength } from 'class-validator';

export class GetOidcCallbackSessionDto {
  @IsString()
  @MinLength(1)
  readonly interactionId: string;
}
