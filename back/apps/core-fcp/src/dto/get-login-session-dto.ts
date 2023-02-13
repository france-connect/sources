import { IsString, MinLength } from 'class-validator';

export class GetLoginSessionDto {
  @IsString()
  @MinLength(1)
  readonly interactionId: string;
}
