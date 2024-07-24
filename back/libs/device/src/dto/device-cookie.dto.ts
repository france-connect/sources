/* istanbul ignore file */

// Declarative file
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class DeviceUserEntry {
  @IsString()
  @IsNotEmpty()
  // Identity Hash
  readonly h: string;

  @IsNumber()
  // Last connection Date (ms)
  readonly d: number;
}

export class DeviceCookieDto {
  @IsString()
  @MinLength(32)
  // Browser wise Salt
  readonly s: string;

  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => DeviceUserEntry)
  // Users Entries
  readonly e: DeviceUserEntry[];
}
