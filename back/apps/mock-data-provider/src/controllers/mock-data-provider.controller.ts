import { Response } from 'express';
import { JSONWebKeySet } from 'jose';

import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ArrayAsyncHelper } from '@fc/common';
import { ConfigService } from '@fc/config';
import {
  DataProviderAdapterCoreConfig,
  DataProviderAdapterCoreService,
} from '@fc/data-provider-adapter-core';
import { JwkHelper } from '@fc/jwt';
import { LoggerService } from '@fc/logger';
import { DataParamsDto } from '@fc/mock-data-provider/dto';

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

  @Post(MockDataProviderRoutes.DATA)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async data(
    @Res({ passthrough: true }) res: Response,
    @Body() body: DataParamsDto,
    @Headers('authorization') authorization = '',
  ): Promise<any> {
    const encodedBearer = authorization.replace('Bearer ', '');
    const accessToken = Buffer.from(encodedBearer, 'base64').toString('utf-8');

    const { auth_secret: receivedSecret } = body;

    try {
      this.mockDataProvider.authenticateServiceProvider(receivedSecret);

      const claims = await this.dataProviderAdapterCore.checktoken(accessToken);

      return claims;
    } catch (exception) {
      this.logger.err(exception);

      const { error, message, httpStatusCode } = exception;

      const result = {
        error,
        error_description: message,
      };

      res.status(httpStatusCode);
      return result;
    }
  }

  @Get(MockDataProviderRoutes.JWKS)
  async jwks(): Promise<JSONWebKeySet> {
    const {
      jwks: { keys },
    } = this.config.get<DataProviderAdapterCoreConfig>(
      'DataProviderAdapterCore',
    );

    const publicKeys = await ArrayAsyncHelper.mapAsync(
      keys,
      async (key) => await JwkHelper.publicFromPrivate(key),
    );
    return { keys: publicKeys } as JSONWebKeySet;
  }
}
