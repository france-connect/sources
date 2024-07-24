/* istanbul ignore file */

// Declarative code
import { IsAscii, IsString, Matches, MinLength } from 'class-validator';

const SAFE_STRING_REGEX = /^[^.*?{}()|[\]\s\\]*$/;

export class RevocationTokenParamsDTO {
  @IsString()
  @MinLength(43)
  @Matches(SAFE_STRING_REGEX)
  readonly token: string;

  @IsString()
  readonly client_id: string;

  @IsString()
  @MinLength(32)
  @IsAscii()
  readonly client_secret: string;
}
