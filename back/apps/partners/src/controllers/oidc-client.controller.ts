import { cloneDeep } from 'lodash';

import {
  Controller,
  Get,
  Header,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AccountPermissionRepository } from '@fc/access-control';
import { ConfigService } from '@fc/config';
import { IdentityProviderAdapterEnvService } from '@fc/identity-provider-adapter-env';
import { OidcSession } from '@fc/oidc';
import { OidcAcrConfig } from '@fc/oidc-acr';
import {
  OidcClientConfig,
  OidcClientRoutes,
  OidcClientService,
  OidcClientSession,
} from '@fc/oidc-client';
import { OidcProviderPrompt } from '@fc/oidc-provider';
import {
  PartnersAccountService,
  PartnersAccountSession,
} from '@fc/partners-account';
import {
  ISessionService,
  Session,
  SessionNotFoundException,
  SessionService,
} from '@fc/session';

import { AppConfig } from '../dto';
import { PartnersBackRoutes, PartnersFrontRoutes } from '../enums';
import { AgentIdentityInterface } from '../interfaces';

@Controller()
export class OidcClientController {
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    private readonly oidcClient: OidcClientService,
    private readonly identityProvider: IdentityProviderAdapterEnvService,
    private readonly config: ConfigService,
    private readonly sessionService: SessionService,
    private readonly partnersAccount: PartnersAccountService,
    private readonly accessControl: AccountPermissionRepository,
  ) {}

  @Get(OidcClientRoutes.REDIRECT_TO_IDP)
  @Header('cache-control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async redirectToIdp(
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<void> {
    const { defaultAcrValue: acr_values } =
      this.config.get<OidcAcrConfig>('OidcAcr');

    const { scope } = this.config.get<OidcClientConfig>('OidcClient');

    const { agentConnectIdpHint } = this.config.get<AppConfig>('App');

    const { nonce, state } =
      await this.oidcClient.utils.buildAuthorizeParameters();

    const prompt = [OidcProviderPrompt.LOGIN].join(' ');

    const authorizeParams = {
      acr_values,
      nonce,
      scope,
      state,
      prompt,
    };

    const authorizationUrl = await this.oidcClient.utils.getAuthorizeUrl(
      agentConnectIdpHint,
      authorizeParams,
    );

    const { name: idpName, title: idpLabel } =
      await this.identityProvider.getById(agentConnectIdpHint);
    const session: OidcClientSession = {
      idpId: agentConnectIdpHint,
      idpName,
      idpLabel,
      idpNonce: nonce,
      idpState: state,
    };

    sessionOidc.set(session);

    res.redirect(authorizationUrl);
  }

  @Get(OidcClientRoutes.OIDC_CALLBACK)
  @Header('cache-control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getOidcCallback(
    @Req() req,
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
    @Session('PartnersAccount')
    sessionPartnersAccount: ISessionService<PartnersAccountSession>,
  ) {
    const session: OidcSession = sessionOidc.get();

    if (!session) {
      throw new SessionNotFoundException('OidcClient');
    }

    const { idpId, idpNonce: nonce, idpState: state } = session;

    const tokenParams = {
      nonce,
      state,
    };
    const { accessToken, acr, idToken } =
      await this.oidcClient.getTokenFromProvider(idpId, tokenParams, req);

    const userInfoParams = {
      accessToken,
      idpId,
    };

    const identity =
      await this.oidcClient.getUserInfosFromProvider<AgentIdentityInterface>(
        userInfoParams,
        req,
      );

    const identityExchange: OidcSession = cloneDeep({
      idpAccessToken: accessToken,
      idpAcr: acr,
      idpIdentity: identity,
      idpIdToken: idToken,
    });

    sessionOidc.set(identityExchange);

    let partnersAccount: PartnersAccountSession = {
      sub: identity.sub,
      firstname: identity.given_name,
      lastname: identity.usual_name,
      email: identity.email,
      siren: identity.siren,
    };

    const { identifiers } = await this.partnersAccount.upsert(partnersAccount);

    partnersAccount = {
      ...partnersAccount,
      accountId: identifiers[0].id,
    };
    sessionPartnersAccount.set(partnersAccount);

    await this.accessControl.init(identifiers[0].id);

    // Temporary redirect
    res.redirect(PartnersFrontRoutes.INDEX);
  }

  @Get(PartnersBackRoutes.LOGOUT)
  @Header('cache-control', 'no-store')
  async logout(
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const session: OidcSession = sessionOidc.get();

    if (!session?.idpIdToken) {
      return res.redirect(PartnersFrontRoutes.INDEX);
    }

    const { idpIdToken, idpState, idpId } = session;

    const { postLogoutRedirectUri } =
      this.config.get<OidcClientConfig>('OidcClient');

    const endSessionUrl: string =
      await this.oidcClient.getEndSessionUrlFromProvider(
        idpId,
        idpState,
        idpIdToken,
        postLogoutRedirectUri,
      );

    res.redirect(endSessionUrl);
  }

  @Get(PartnersBackRoutes.LOGOUT_CALLBACK)
  @Header('cache-control', 'no-store')
  async logoutCallback(@Res() res) {
    // delete oidc session
    await this.sessionService.reset(res);

    return res.redirect(PartnersFrontRoutes.INDEX);
  }
}
