/* istanbul ignore file */

// Declarative code
import { IsArray, IsString } from 'class-validator';

export class SpAuthorizedFqdnsConfig {
  @IsString()
  readonly spId: string;

  @IsString()
  readonly spName: string;

  @IsString()
  readonly spContact: string;

  @IsArray()
  @IsString({ each: true })
  readonly authorizedFqdns: string[];
}
