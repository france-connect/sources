/* istanbul ignore file */

// Declarative code
import { ArrayMinSize, IsArray, IsBoolean, IsString } from 'class-validator';

export class IdpSettingsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  idpList: string[];

  @IsBoolean()
  allowFutureIdp: boolean;
}
