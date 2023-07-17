import { Response } from 'express';

import { Controller, Get, Res } from '@nestjs/common';

import { DataProviderAdapterCoreService } from '@fc/data-provider-adapter-core';

import { MockDataProviderRoutes } from '../enums';

@Controller(MockDataProviderRoutes.BASE)
export class MockDataProviderController {
  constructor(
    private readonly dataProviderAdapterCoreService: DataProviderAdapterCoreService,
  ) {}

  @Get(MockDataProviderRoutes.DATA)
  async data(@Res({ passthrough: true }) res: Response): Promise<any> {
    try {
      const { data, status } =
        await this.dataProviderAdapterCoreService.checktoken(
          'unrevelent_mock_access_token',
        );

      res.status(status);
      return data;
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
}
