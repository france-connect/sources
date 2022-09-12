import { Response } from 'express';

import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { PartnerAccountSession } from '@fc/partner-account';
import { ISessionService, Session } from '@fc/session';

import { LoginCredentials } from '../dto';
import { PartnersRoutes } from '../enums';
import { ILoggedUser } from '../interfaces';
import { PartnersService } from '../services';

@Controller()
export class AccountController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get(PartnersRoutes.CSRF)
  async getCSRF(@Res() res: Response): Promise<Record<string, any>> {
    // @TODO remove or implement true CSRF
    return res.json({ csrfToken: 'any_valid_csrf_token' });
  }

  @Get(PartnersRoutes.ME)
  async getUserInfos(
    @Res() res: Response,
    @Session('PartnerAccount')
    sessionPartnerAccount: ISessionService<PartnerAccountSession>,
  ): Promise<Record<string, any>> {
    try {
      const { firstname, lastname } = await sessionPartnerAccount.get();
      return res.json({
        firstname,
        lastname,
      });
    } catch {
      res.status(403).end();
    }
  }

  @Post(PartnersRoutes.LOGIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(
    @Body() body: LoginCredentials,
    @Session('PartnerAccount')
    sessionPartnerAccount: ISessionService<PartnerAccountSession>,
  ): Promise<ILoggedUser> {
    const user = await this.partnersService.login(body.email);

    await sessionPartnerAccount.set(user);
    return user;
  }
}
