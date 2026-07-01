import { Request, Response } from 'express';

import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { OidcSession } from '@fc/oidc';
import { OidcProviderRoutes, OidcProviderService } from '@fc/oidc-provider';
import { SessionService } from '@fc/session';

import { AuthorizeParamsDto } from '../dto';
import { WalletBridgeIdentityService } from '../services';

@Controller()
export class OidcProviderController {
  constructor(
    private readonly oidcProvider: OidcProviderService,
    private readonly session: SessionService,
    private readonly identityService: WalletBridgeIdentityService,
  ) {}

  @Get(OidcProviderRoutes.AUTHORIZATION)
  @Header('cache-control', 'no-store')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async getAuthorize(
    @Req() req: Request,
    @Res() res: Response,
    @Query() _query: AuthorizeParamsDto,
  ) {
    await this.session.reset(res);
    await this.oidcProvider.callback(req, res);
  }

  @Post(OidcProviderRoutes.AUTHORIZATION)
  @Header('cache-control', 'no-store')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async postAuthorize(
    @Req() req: Request,
    @Res() res: Response,
    @Body() _body: AuthorizeParamsDto,
  ) {
    await this.session.reset(res);
    await this.oidcProvider.callback(req, res);
  }

  @Get('/interaction/:uid')
  @Header('cache-control', 'no-store')
  async getInteraction(@Req() req: Request, @Res() res: Response) {
    await this.identityService.finishInteraction(req, res, {} as OidcSession);
  }
}
