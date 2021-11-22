import { IsString } from 'class-validator';

export class CsrfToken {
  @IsString()
  readonly _csrf: string;
}
