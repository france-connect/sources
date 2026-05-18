import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import {
  DatapassApiService,
  DatapassEidasLevels,
  DatapassPayloadInterface,
} from '@fc/datapass';
import { LoggerService } from '@fc/logger';
import { HUB_SIGN_HEADER, WebhooksService } from '@fc/webhooks';

import { WEBHOOK_NAME } from '../constants';
import { WebhooksPartnersConfig } from '../dto';
import { ImportBatchResultInterface } from '../interfaces';

@Injectable()
export class ImportDatapassService {
  // More than 4 parameters in constructor is allowed for DI
  // eslint-disable-next-line max-params
  constructor(
    private readonly config: ConfigService,
    private readonly datapassApi: DatapassApiService,
    private readonly webhooks: WebhooksService,
    private readonly httpService: HttpService,
    private readonly logger: LoggerService,
  ) {}

  async importAll(
    eidasLevels: DatapassEidasLevels[],
    dryRun: boolean,
    since?: Date,
  ): Promise<ImportBatchResultInterface> {
    const requests = await this.datapassApi.getHabilitations(
      eidasLevels,
      since,
    );

    let success = 0;
    let failure = 0;

    for (const request of requests) {
      const sent = await this.processOne(request, dryRun);
      if (sent) {
        success++;
      } else {
        failure++;
      }
    }

    return { total: requests.length, success, failure };
  }

  private processOne(
    payload: DatapassPayloadInterface,
    dryRun?: boolean,
  ): Promise<boolean> {
    if (dryRun) {
      this.logger.info({
        message: '[DRY-RUN] Would import habilitation',
        datapassRequestId: payload.data.id,
      });
      return Promise.resolve(true);
    }

    return this.sendToWebhook(payload);
  }

  async importById(id: number): Promise<void> {
    const payload = await this.datapassApi.getHabilitationById(id);
    await this.sendToWebhook(payload);
  }

  private async sendToWebhook(
    payload: DatapassPayloadInterface,
  ): Promise<boolean> {
    const { url } = this.config.get<WebhooksPartnersConfig>('WebhooksPartners');

    const jsonPayload = JSON.stringify(payload);
    const signature = this.webhooks.sign(WEBHOOK_NAME, jsonPayload);

    try {
      await lastValueFrom(
        this.httpService.post(url, jsonPayload, {
          headers: {
            'Content-Type': 'application/json',
            [HUB_SIGN_HEADER]: signature,
          },
        }),
      );

      this.logger.info({
        message: 'Habilitation imported',
        datapassRequestId: payload.data.id,
      });

      return true;
    } catch (error) {
      const axiosError = error as {
        message: string;
        response?: { data: unknown };
      };

      this.logger.warning({
        message: 'Failed to import habilitation',
        datapassRequestId: payload.data.id,
        error: axiosError.message,
        responseBody: axiosError.response?.data,
      });

      return false;
    }
  }
}
