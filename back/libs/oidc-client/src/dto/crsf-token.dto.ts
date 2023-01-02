import { IsAscii, IsString } from 'class-validator';

export class CrsfToken {
  @IsString()
  @IsAscii()
  readonly csrfToken: string;
}
