import { IsString, MinLength } from 'class-validator';

export class InteractionSessionDto {
  @IsString()
  @MinLength(1)
  readonly interactionId: string;
}
