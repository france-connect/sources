import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber } from 'class-validator';

export class DeviceSession {
  @IsNumber()
  @Expose()
  readonly accountCount: number;

  @IsBoolean()
  @Expose()
  readonly isSuspicious: boolean;

  @IsBoolean()
  @Expose()
  readonly isTrusted: boolean;
}
