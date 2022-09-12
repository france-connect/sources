import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';

import { LoggerService } from '@fc/logger-legacy';
import { PartnerAccountSession } from '@fc/partner-account';
import { ISessionService, Session } from '@fc/session';

import { PartnersRoutes } from '../enums';
import { IServiceProviderList } from '../interfaces';
import { PartnersService } from '../services';

@Controller()
export class ServiceProviderController {
  constructor(
    private readonly partnersService: PartnersService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Get(PartnersRoutes.SERVICE_PROVIDER)
  async getServiceProvidersByAccount(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Res() res,
    @Session('PartnerAccount')
    sessionPartnerAccount: ISessionService<PartnerAccountSession>,
  ): Promise<IServiceProviderList> {
    let accountId: string;

    try {
      const { id } = await sessionPartnerAccount.get();
      accountId = id;
    } catch (error) {
      this.logger.error(error);
    }

    if (!accountId) {
      return res.status(401).end();
    }
    const serviceProviderList =
      await this.partnersService.getServiceProvidersByAccount(
        accountId,
        offset,
        limit,
      );

    this.logger.trace({ ...serviceProviderList });
    return res.json(serviceProviderList);
  }
}
