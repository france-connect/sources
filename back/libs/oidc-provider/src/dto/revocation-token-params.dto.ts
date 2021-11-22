/* istanbul ignore file */

// Declarative code
import {
  IsAlphanumeric,
  IsAscii,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

const SAFE_STRING_REGEX = /^[^.*?{}()|[\]\s\\]*$/;

export class RevocationTokenParamsDTO {
  @IsString()
  @MinLength(43)
  @Matches(SAFE_STRING_REGEX)
  readonly token: string;

  @IsString()
  @IsAlphanumeric()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_id: string;

  @IsString()
  @MinLength(32)
  @IsAscii()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_secret: string;
}
