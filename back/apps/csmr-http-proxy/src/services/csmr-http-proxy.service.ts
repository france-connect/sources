import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { BridgePayload, BridgeResponse } from '@fc/hybridge-http-proxy';
import { LoggerService } from '@fc/logger-legacy';

@Injectable()
export class CsmrHttpProxyService {
  constructor(
    private logger: LoggerService,
    private http: HttpService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * get the data from FI based on Bridge request params
   * @param {HttpProxyRequest} options
   * @returns {Promise<HttpProxyResponse>}
   */
  async forwardRequest(commands: BridgePayload): Promise<BridgeResponse> {
    this.logger.debug('forwardRequest()');
    this.logger.trace({ commands });

    const {
      url,
      method,
      headers: requestHeaders,
      data: requestData,
    } = commands;

    const config: AxiosRequestConfig = {
      headers: requestHeaders,
    };

    const options: Array<unknown> = [url, requestData, config].filter(Boolean);

    const { status, statusText, headers, data } = await lastValueFrom<
      AxiosResponse<string>
    >(this.http[method](...options));

    const response: BridgeResponse = {
      status,
      data,
      statusText,
      headers,
    };

    this.logger.trace({ response });

    return response;
  }
}
