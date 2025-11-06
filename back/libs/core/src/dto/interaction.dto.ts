import { IsAscii, IsString, Length } from 'class-validator';

export class Interaction {
  @IsString()
  @IsAscii()
  @Length(21, 60)
  readonly uid: string;
}
