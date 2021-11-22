/* istanbul ignore file */

// Declarative code
import { IsString, Matches, MinLength } from 'class-validator';

const SAFE_STRING_REGEX = /^[^.*?{}()|[\]\s\\]*$/;

export class AccessTokenParamsDTO {
  @IsString()
  @MinLength(43)
  @Matches(SAFE_STRING_REGEX)
  accessToken: string;
}
