import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { AppCliConfig } from '@fc/app';
import { HttpOtrsClientConfigDto } from '@fc/http-otrs-client';
import { LoggerConfig } from '@fc/logger';

export class CommandSupportTicketConfigDto {
  @IsObject()
  @ValidateNested()
  @Type(() => AppCliConfig)
  readonly App: AppCliConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => HttpOtrsClientConfigDto)
  readonly HttpOtrsClient: HttpOtrsClientConfigDto;

  @IsObject()
  @ValidateNested()
  @Type(() => LoggerConfig)
  readonly Logger: LoggerConfig;
}
