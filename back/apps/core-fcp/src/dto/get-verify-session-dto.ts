import { IsString, MinLength } from 'class-validator';

export class GetVerifySessionDto {
  @IsString()
  @MinLength(1)
  readonly interactionId: string;
}
