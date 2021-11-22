import {
  Body,
  Controller,
  Get,
  Next,
  Post,
  Render,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { LoggerLevelNames, LoggerService } from '@fc/logger';
import { OidcClientSession } from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import { ISessionService, Session, SessionService } from '@fc/session';

import { AppSession, SignInDTO } from '../dto';
import { MockIdentityProviderRoutes } from '../enums';
import { MockIdentityProviderService } from '../services';

@Controller()
export class MockIdentityProviderController {
  constructor(
    private readonly logger: LoggerService,
    private readonly oidcProvider: OidcProviderService,
    private readonly mockIdentityProviderService: MockIdentityProviderService,
    private readonly sessionService: SessionService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Get(MockIdentityProviderRoutes.INDEX)
  async index() {
    const response = { status: 'ok' };

    this.logger.trace({
      route: MockIdentityProviderRoutes.INDEX,
      method: 'GET',
      name: 'MockIdentityProviderRoutes.INDEX',
      response,
    });

    return response;
  }

  @Get(MockIdentityProviderRoutes.INTERACTION)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Render('interaction')
  async getInteraction(
    @Req()
    req,
    @Res()
    res,
    /**
     * @todo Adaptation for now, correspond to the oidc-provider side.
     * Named "OidcClient" because we need a future shared session between our libs oidc-provider and oidc-client
     * without a direct dependance like now.
     * @author Hugues
     * @date 2021-04-16
     * @ticket FC-xxx
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
    @Session('App') appSession: ISessionService<AppSession>,
  ) {
    const { uid, params } = await this.oidcProvider.getInteraction(req, res);

    const spName = await sessionOidc.get('spName');
    const finalSpId = await appSession.get('finalSpId');

    const response = {
      uid,
      params,
      spName,
      finalSpId,
    };

    this.logger.trace({
      route: MockIdentityProviderRoutes.INTERACTION,
      method: 'GET',
      name: 'MockIdentityProviderRoutes.INTERACTION',
      response,
    });

    return response;
  }

  @Post(MockIdentityProviderRoutes.INTERACTION_LOGIN)
  async getLogin(
    @Next() next,
    @Req() req,
    @Body() body: SignInDTO,
    /**
     * @todo Adaptation for now, correspond to the oidc-provider side.
     * Named "OidcClient" because we need a future shared session between our libs oidc-provider and oidc-client
     * without a direct dependance like now.
     * @author Hugues
     * @date 2021-04-16
     * @ticket FC-xxx
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<void> {
    const { login, acr } = body;
    const spIdentity = await this.mockIdentityProviderService.getIdentity(
      login,
    );

    if (!spIdentity) {
      this.logger.trace({ spIdentity }, LoggerLevelNames.WARN);
      throw new Error('Identity not found in database');
    }

    const spAcr = acr;
    /**
     * We need to set an alias with the sub since later (findAccount) we do not have access
     * to the sessionId, nor the interactionId.
     */
    await this.sessionService.setAlias(spIdentity.sub, req.sessionId);

    sessionOidc.set({
      spAcr,
      spIdentity,
    });

    this.logger.trace({
      route: MockIdentityProviderRoutes.INTERACTION_LOGIN,
      method: 'POST',
      name: 'MockIdentityProviderRoutes.INTERACTION_LOGIN',
      spIdentity,
    });

    return next();
  }
}
