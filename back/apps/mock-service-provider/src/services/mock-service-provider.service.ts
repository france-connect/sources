import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger';

@Injectable()
export class MockServiceProviderService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: LoggerService,
  ) {}

  async getData(
    apiUrl: string,
    accessToken: string,
    authSecret?: string,
  ): Promise<unknown> {
    const requestConfig = authSecret
      ? this.getConfigForPostRequestWithAuthSecret(
          apiUrl,
          accessToken,
          authSecret,
        )
      : this.getConfigForGetRequest(apiUrl, accessToken);
    try {
      const response = await lastValueFrom(
        this.httpService.request(requestConfig),
      );

      return response.data;
    } catch (exception) {
      this.logger.err(exception);
      throw exception.response.data;
    }
  }

  private getConfigForPostRequestWithAuthSecret(
    apiUrl: string,
    accessToken: string,
    authSecret: string,
  ): AxiosRequestConfig {
    const bearer = Buffer.from(accessToken, 'utf-8').toString('base64');
    const requestConfig: AxiosRequestConfig = {
      url: apiUrl,
      method: 'post',
      headers: {
        Authorization: `Bearer ${bearer}`,
      },
      data: {
        // Input data for the mock-data-provider endpoint
        // eslint-disable-next-line @typescript-eslint/naming-convention
        auth_secret: authSecret,
      },
      proxy: false,
    };
    return requestConfig;
  }

  private getConfigForGetRequest(
    apiUrl: string,
    accessToken: string,
  ): AxiosRequestConfig {
    const requestConfig: AxiosRequestConfig = {
      url: apiUrl,
      method: 'get',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      proxy: false,
    };
    return requestConfig;
  }
}
