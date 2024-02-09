import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { BridgePayload, BridgeResponse } from '@fc/hybridge-http-proxy';

@Injectable()
export class CsmrHttpProxyService {
  constructor(private http: HttpService) {}

  /**
   * get the data from FI based on Bridge request params
   * @param {HttpProxyRequest} options
   * @returns {Promise<HttpProxyResponse>}
   */
  async forwardRequest(commands: BridgePayload): Promise<BridgeResponse> {
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

    return response;
  }
}
