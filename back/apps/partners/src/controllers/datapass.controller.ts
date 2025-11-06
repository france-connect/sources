import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import {
  DatapassTransformationPipe,
  SimplifiedDatapassPayload,
} from '@fc/datapass';
import { LoggerService } from '@fc/logger';
import { Webhooks, WebhooksGuard } from '@fc/webhooks';

import { PartnersBackRoutes, PartnersHookNames } from '../enums';
import { PartnersDatapassService } from '../services';

@Controller()
export class DatapassWebhookController {
  constructor(
    private readonly logger: LoggerService,
    private readonly partnersDatapassService: PartnersDatapassService,
  ) {}

  @Post(PartnersBackRoutes.DATAPASS_WEBHOOK)
  @UsePipes(DatapassTransformationPipe)
  @Webhooks(PartnersHookNames.DATAPASS)
  @UseGuards(WebhooksGuard)
  async handleWebhook(
    @Body() payload: SimplifiedDatapassPayload,
    @Res() res,
  ): Promise<void> {
    this.logger.info({
      message: 'Datapass webhook received and validated',
      event: payload.event,
      datapassRequestId: payload.datapassRequestId,
    });

    const { statusCode, serviceProviderId } =
      await this.partnersDatapassService.handleWebhookEvent(payload);

    res.status(statusCode).json({
      token_id: serviceProviderId,
    });
  }
}
