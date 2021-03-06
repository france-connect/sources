import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import {
  OidcClientRoutes,
  OidcClientService,
  OidcClientSession,
  RedirectToIdp,
} from '@fc/oidc-client';
import {
  ISessionService,
  Session,
  SessionCsrfService,
  SessionInvalidCsrfSelectIdpException,
} from '@fc/session';

@Controller()
export class OidcClientController {
  constructor(
    private readonly logger: LoggerService,
    private readonly oidcClient: OidcClientService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
    private readonly csrfService: SessionCsrfService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * @todo #242 get configured parameters (scope and acr)
   */
  @Post(OidcClientRoutes.REDIRECT_TO_IDP)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async redirectToIdp(
    @Res() res,
    @Body() body: RedirectToIdp,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<void> {
    const {
      // acr_values is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values,
      claims,
      csrfToken,
      providerUid: idpId,
      scope,
    } = body;

    let serviceProviderId: string | null;
    try {
      const { spId } = await sessionOidc.get();
      serviceProviderId = spId;
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      serviceProviderId = null;
    }

    // -- control if the CSRF provided is the same as the one previously saved in session.
    try {
      await this.csrfService.validate(sessionOidc, csrfToken);
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      throw new SessionInvalidCsrfSelectIdpException(error);
    }

    if (serviceProviderId) {
      await this.oidcClient.utils.checkIdpBlacklisted(serviceProviderId, idpId);
    }

    const { nonce, state } =
      await this.oidcClient.utils.buildAuthorizeParameters();

    const authorizationUrl = await this.oidcClient.utils.getAuthorizeUrl({
      // acr_values is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values,
      claims,
      nonce,
      idpId,
      scope,
      state,
    });

    const { name: idpName, title: idpLabel } =
      await this.identityProvider.getById(idpId);
    const session: OidcClientSession = {
      idpId,
      idpName,
      idpLabel,
      idpNonce: nonce,
      idpState: state,
    };

    await sessionOidc.set(session);

    this.logger.trace({
      body,
      method: 'POST',
      name: 'OidcClientRoutes.REDIRECT_TO_IDP',
      redirect: authorizationUrl,
      res,
      route: OidcClientRoutes.REDIRECT_TO_IDP,
      session,
    });

    res.redirect(authorizationUrl);
  }

  /**
   * @TODO #141 implement proper well-known
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/141
   *  - generated by openid-client
   *  - pub keys orverrided by keys from HSM
   */
  @Get(OidcClientRoutes.WELL_KNOWN_KEYS)
  async getWellKnownKeys() {
    this.logger.trace({
      method: 'GET',
      name: 'OidcClientRoutes.WELL_KNOWN_KEYS',
      route: OidcClientRoutes.WELL_KNOWN_KEYS,
    });
    return this.oidcClient.utils.wellKnownKeys();
  }
}
