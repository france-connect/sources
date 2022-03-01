/* istanbul ignore file */

// declarative file
import { IsBoolean, IsString } from 'class-validator';

export class UserPreferencesDto {
  @IsString()
  uid: string;

  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsString()
  title: string;

  @IsBoolean()
  active: boolean;

  @IsBoolean()
  isChecked: boolean;
}
