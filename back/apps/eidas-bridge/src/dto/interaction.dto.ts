import { IsAscii, IsString, Length } from 'class-validator';

export class Interaction {
  @IsString()
  @IsAscii()
  @Length(21, 21)
  readonly uid: string;
}
