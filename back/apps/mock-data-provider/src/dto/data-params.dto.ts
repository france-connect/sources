/* istanbul ignore file */

// Declarative code
import { IsString } from 'class-validator';

export class DataParamsDto {
  @IsString()
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly auth_secret: string;
}
