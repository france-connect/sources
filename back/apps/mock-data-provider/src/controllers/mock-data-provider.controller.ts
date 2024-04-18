import { Response } from 'express';
import { JSONWebKeySet } from 'jose';

import { Controller, Get, Headers, Res } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import {
  DataProviderAdapterCoreConfig,
  DataProviderAdapterCoreService,
} from '@fc/data-provider-adapter-core';
import { LoggerService } from '@fc/logger';

import { MockDataProviderRoutes } from '../enums';
import { MockDataProviderService } from '../services';

@Controller(MockDataProviderRoutes.BASE)
export class MockDataProviderController {
  constructor(
    private readonly dataProviderAdapterCore: DataProviderAdapterCoreService,
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly mockDataProvider: MockDataProviderService,
  ) {}

  @Get(MockDataProviderRoutes.DATA)
  async data(
    @Res({ passthrough: true }) res: Response,
    @Headers('authorization') authorization = '',
  ): Promise<any> {
    const encodedBearer = authorization.replace('Bearer ', '');
    const bearer = Buffer.from(encodedBearer, 'base64').toString('utf-8');
    const [accessToken, receivedSecret] = bearer.split(':');

    try {
      this.mockDataProvider.authenticateServiceProvider(receivedSecret);

      const claims = await this.dataProviderAdapterCore.checktoken(accessToken);

      return claims;
    } catch (exception) {
      this.logger.err(exception);

      const { error, message, httpStatusCode } = exception;

      const result = {
        error,
        // oidc compliant
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: message,
      };

      res.status(httpStatusCode);
      return result;
    }
  }

  @Get(MockDataProviderRoutes.JWKS)
  jwks(): JSONWebKeySet {
    const { jwks } = this.config.get<DataProviderAdapterCoreConfig>(
      'DataProviderAdapterCore',
    );
    return jwks;
  }
}
