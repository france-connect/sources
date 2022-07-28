/* istanbul ignore file */

// Declarative code
import { IsAscii } from 'class-validator';

export class GetAccountIdPayloadDto {
  @IsAscii()
  identityHash: string;
}
