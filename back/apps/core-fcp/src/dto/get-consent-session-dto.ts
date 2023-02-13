import { IsString, MinLength } from 'class-validator';

export class GetConsentSessionDto {
  @IsString()
  @MinLength(1)
  readonly interactionId: string;
}
