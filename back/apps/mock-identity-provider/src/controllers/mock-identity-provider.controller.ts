import { Request, Response } from 'express';

import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { getDtoInputWithErrors, getTransformed, validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { OidcClientSession } from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import { ISessionService, Session } from '@fc/session';

import { AppConfig, AppSession, SignInDTO } from '../dto';
import { MockIdentityProviderRoutes } from '../enums';
import { CustomIdentityGuard } from '../guards';
import { MinimalCustomIdentityInterface } from '../interfaces';
import { MockIdentityProviderService } from '../services';

const DEFAULT_USER_LOGIN = 'test';

@Controller()
export class MockIdentityProviderController {
  constructor(
    private readonly config: ConfigService,
    private readonly oidcProvider: OidcProviderService,
    private readonly mockIdentityProviderService: MockIdentityProviderService,
  ) {}

  @Get(MockIdentityProviderRoutes.INDEX)
  index() {
    const response = { status: 'ok' };

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
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
    @Session('App') appSession: ISessionService<AppSession>,
  ) {
    const { uid, params } = await this.oidcProvider.getInteraction(req, res);

    const spName = sessionOidc.get('spName');
    const finalSpId = appSession.get('finalSpId');

    const response = {
      uid,
      params,
      spName,
      finalSpId,
      login: params.login_hint || DEFAULT_USER_LOGIN,
    };

    return response;
  }

  // More than 4 parameters authorized for dependency injection
  // eslint-disable-next-line max-params
  @Post(MockIdentityProviderRoutes.INTERACTION_LOGIN)
  getLogin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: SignInDTO,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
    @Session('App')
    sessionApp: ISessionService<AppSession>,
  ): void {
    const { login, password, acr } = body;
    const spIdentity = this.mockIdentityProviderService.getIdentity(login);

    if (!spIdentity) {
      throw new Error('Identity not found in database');
    }

    if (
      !this.mockIdentityProviderService.isPasswordValid(
        spIdentity.password,
        password,
      )
    ) {
      throw new Error('Password is invalid');
    }

    sessionApp.set('userLogin', login);

    const spId = sessionOidc.get('spId');
    const { sub, ...spIdentityCleaned } = spIdentity;
    const spAcr = acr;

    sessionOidc.set({
      spAcr,
      spIdentity: spIdentityCleaned,
      amr: ['pwd'],
      subs: { [spId]: sub },
    });

    const session = sessionOidc.get();

    return this.oidcProvider.finishInteraction(req, res, session);
  }

  @Get(MockIdentityProviderRoutes.INTERACTION_LOGIN_CUSTOM)
  @Render('interaction-login-custom')
  @UseGuards(CustomIdentityGuard)
  getLoginCustom() {
    const { identityForm } = this.config.get<AppConfig>('App');
    const data = {};

    return { identityForm, data };
  }

  @Post(MockIdentityProviderRoutes.INTERACTION_LOGIN_CUSTOM)
  @UseGuards(CustomIdentityGuard)
  async postLoginCustom(
    @Body() identity: MinimalCustomIdentityInterface,
    @Req() req: Request,
    @Res() res: Response,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const { identityDto } = this.config.get<AppConfig>('App');
    const options = { whitelist: true };
    const errors = await validateDto(identity, identityDto, options);

    if (errors.length > 0) {
      const { identityForm } = this.config.get<AppConfig>('App');

      const data = getDtoInputWithErrors(errors);

      return res.render('interaction-login-custom', { identityForm, data });
    }

    const transformedIdentity = getTransformed(identity, identityDto);

    this.prepareIdentity(transformedIdentity, sessionOidc);

    const session = sessionOidc.get();

    return this.oidcProvider.finishInteraction(req, res, session);
  }

  private prepareIdentity(
    identity: MinimalCustomIdentityInterface,
    sessionOidc: ISessionService<OidcClientSession>,
  ): void {
    const { acr, ...spIdentityCleaned } = identity;
    const { spId } = sessionOidc.get();
    const sub = this.mockIdentityProviderService.getSub(spIdentityCleaned);

    sessionOidc.set({
      spAcr: acr,
      spIdentity: spIdentityCleaned,
      amr: ['pwd'],
      subs: { [spId]: sub },
    });
  }
}
