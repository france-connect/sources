import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class DeviceHeaderFlag {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly positiveValue: string;
}

export class DeviceConfig {
  @IsString({ each: true })
  @MinLength(16, { each: true })
  readonly identityHmacSecret: string[];

  @IsNumber()
  readonly identityHmacDailyTtl: number;

  @IsString()
  @IsNotEmpty()
  readonly cookieName: string;

  @IsString()
  @IsNotEmpty()
  readonly cookieDomain: string;

  @IsNumber()
  readonly maxIdentityNumber: number;

  @IsNumber()
  readonly maxIdentityTrusted: number;

  @IsArray()
  @IsString({ each: true })
  readonly identityHashSourceProperties: string[];

  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => DeviceHeaderFlag)
  readonly headerFlags: DeviceHeaderFlag[];
}
