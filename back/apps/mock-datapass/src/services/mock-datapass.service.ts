import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { DatapassEvents, DatapassPayloadInterface } from '@fc/datapass';
import { HUB_SIGN_HEADER, WebhooksService } from '@fc/webhooks';

import { AppConfig } from '../dto';

@Injectable()
export class MockDatapassService {
  constructor(
    private readonly config: ConfigService,
    private readonly webhook: WebhooksService,
    private readonly httpService: HttpService,
  ) {}

  async handleWebhook(event: DatapassEvents): Promise<AxiosResponse<unknown>> {
    const payload = this.generatePayload(event);
    const signature = this.webhook.sign('WebhooksDatapass', payload);

    const result = await this.callWebhook(payload, signature);

    return result;
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

  /**
   * Return a dummy event for now.
   * More sophisticated behaviors may be implemented later.
   *
   * Example data from official documentation:
   * @see https://github.com/etalab/data_pass/blob/develop/docs/webhooks.md
   */
  private generatePayload(event: DatapassEvents): string {
    const payload: DatapassPayloadInterface = {
      event,
      fired_at: this.getTimestamp(),
      model_type: 'authorization_request/franceconnect',
      data: {
        id: 9001,
        public_id: 'a90939e8-f906-4343-8996-5955257f161d',
        state: 'approve',
        form_uid: 'franceconnect-demande-libre',
        organization: {
          id: 9002,
          name: 'UMAD CORP',
          siret: '98043033400022',
        },
        applicant: {
          id: 9003,
          email: 'jean.dupont@beta.gouv.fr',
          given_name: 'Jean',
          family_name: 'Dupont',
          phone_number: '0836656565',
          job_title: 'Rockstar',
        },
        data: {
          intitule: 'Ma demande',
          scopes: ['identite_pivot', 'email'],
          contact_technique_given_name: 'Tech',
          contact_technique_family_name: 'Os',
          contact_technique_phone_number: '08366666666',
          contact_technique_job_title: 'DSI',
          contact_technique_email: 'tech@beta.gouv.fr',
        },
      },
    };

    return JSON.stringify(payload);
  }

  private getTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }
}
