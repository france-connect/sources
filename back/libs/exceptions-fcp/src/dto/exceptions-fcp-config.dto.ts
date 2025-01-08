import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ExceptionsFcpConfigItem {
  @IsOptional()
  @IsString()
  actionButtonLabel?: string;

  @IsOptional()
  @IsString()
  actionHref?: string;

  @IsOptional()
  @IsString()
  actionTitle?: string;

  @IsString()
  errorCode: string;

  @IsOptional()
  @IsString()
  errorMessage?: string;

  @IsBoolean()
  active: boolean;
}

export class ExceptionsFcpConfig {
  @ValidateNested()
  @Type(() => ExceptionsFcpConfigItem)
  items: ExceptionsFcpConfigItem[];
}
