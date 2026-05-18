import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import { AxiosError, AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { HUB_SIGN_HEADER, WebhooksService } from '@fc/webhooks';

import { AppConfig } from '../dto';

export interface PayloadPreset {
  id: string;
  label: string;
  payload: string;
}

interface PayloadFixture {
  label: string;
  payload: unknown;
}

@Injectable()
export class MockDatapassService implements OnModuleInit {
  private payloadPresets: PayloadPreset[] = [];

  constructor(
    private readonly config: ConfigService,
    private readonly webhook: WebhooksService,
    private readonly httpService: HttpService,
  ) {}

  onModuleInit(): void {
    const { payloadsPath } = this.config.get<AppConfig>('App');
    const fixtureFilenames = readdirSync(payloadsPath)
      .filter((filename) => filename.endsWith('.json'))
      .sort((firstFilename, secondFilename) =>
        firstFilename.localeCompare(secondFilename),
      );

    this.payloadPresets = fixtureFilenames.map((filename) => {
      const fixturePath = join(payloadsPath, filename);
      const fixture = JSON.parse(
        readFileSync(fixturePath, { encoding: 'utf-8' }),
      ) as PayloadFixture;

      return {
        id: filename,
        label: fixture.label,
        payload: JSON.stringify(fixture.payload, null, 2),
      };
    });
  }

  async handleWebhook(payload: string): Promise<AxiosResponse<unknown>> {
    const signature = this.webhook.sign('WebhooksDatapass', payload);

    try {
      const response = await this.callWebhook(payload, signature);

      return response;
    } catch (error) {
      return this.handleWebhookError(error);
    }
  }

  getPayloadPresets(): PayloadPreset[] {
    return this.payloadPresets;
  }

  private async callWebhook(
    payload: string,
    signature: string,
  ): Promise<AxiosResponse<unknown>> {
    const { webhookUrl } = this.config.get<AppConfig>('App');

    const response = await lastValueFrom(
      this.httpService.post(webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          [HUB_SIGN_HEADER]: signature,
        },
      }),
    );

    return response;
  }

  private handleWebhookError(error: unknown): AxiosResponse<unknown> {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }

    throw error;
  }
}
