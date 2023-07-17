import { AxiosError, AxiosResponse } from 'axios';
import { stringify } from 'qs';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { DataProviderAdapterCoreConfig } from './dto';
import {
  ChecktokenHttpStatusException,
  ChecktokenTimeoutException,
} from './exceptions';
import { ChecktokenResponseInterface } from './interfaces';

@Injectable()
export class DataProviderAdapterCoreService {
  constructor(
    private config: ConfigService,
    private readonly logger: LoggerService,
    private readonly http: HttpService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async checktoken(
    accessToken: string,
  ): Promise<ChecktokenResponseInterface | never> {
    // Based on oidc standard
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { client_id, client_secret, checktokenEndpoint } =
      this.config.get<DataProviderAdapterCoreConfig>('DataProviderAdapterCore');
    const checktokenRequest = {
      // Based on oidc standard
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id,
      // Based on oidc standard
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_secret,
      // Based on oidc standard
      // eslint-disable-next-line @typescript-eslint/naming-convention
      access_token: accessToken,
    };

    try {
      const { status, data } = await lastValueFrom<AxiosResponse<string>>(
        this.http.post(checktokenEndpoint, stringify(checktokenRequest), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );

      return {
        status,
        data,
      };
    } catch (error) {
      this.checktokenHttpError(error);
    }
  }

  private checktokenHttpError(error: AxiosError) {
    switch (error.code) {
      /**
       * At the moment Axios does not use "ETIMEOUT" like native
       * but "ECONNABORTED" @see https://github.com/axios/axios/pull/2874
       */
      case 'ETIMEDOUT':
      case 'ECONNABORTED':
      case 'ECONNRESET':
        throw new ChecktokenTimeoutException();
    }

    throw new ChecktokenHttpStatusException();
  }
}
