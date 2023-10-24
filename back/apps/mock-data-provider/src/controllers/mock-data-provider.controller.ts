import { Response } from 'express';
import { JSONWebKeySet } from 'jose';

import { Controller, Get, Res } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import {
  DataProviderAdapterCoreConfig,
  DataProviderAdapterCoreService,
} from '@fc/data-provider-adapter-core';

import { MockDataProviderRoutes } from '../enums';

@Controller(MockDataProviderRoutes.BASE)
export class MockDataProviderController {
  constructor(
    private readonly dataProviderAdapterCoreService: DataProviderAdapterCoreService,
    private readonly configService: ConfigService,
  ) {}

  @Get(MockDataProviderRoutes.DATA)
  async data(@Res({ passthrough: true }) res: Response): Promise<any> {
    try {
      const claims = await this.dataProviderAdapterCoreService.checktoken(
        'unrevelent_mock_access_token',
      );

      return claims;
    } catch (exception) {
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
  async jwks(): Promise<JSONWebKeySet> {
    const { jwks } =
      await this.configService.get<DataProviderAdapterCoreConfig>(
        'DataProviderAdapterCore',
      );
    return jwks;
  }
}
