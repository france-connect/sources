import { IsEnum } from 'class-validator';

import { DatapassEvents } from '@fc/datapass';

export class PostWebhookBodyDto {
  @IsEnum(DatapassEvents)
  event: string;
}
