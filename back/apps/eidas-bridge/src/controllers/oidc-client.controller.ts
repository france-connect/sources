import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { IdentityProviderAdapterEnvService } from '@fc/identity-provider-adapter-env';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import {
  OidcClientRoutes,
  OidcClientService,
  OidcClientSession,
  RedirectToIdp,
} from '@fc/oidc-client';
import { OidcProviderPrompt } from '@fc/oidc-provider';
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
    private readonly identityProvider: IdentityProviderAdapterEnvService,
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
      scope,
      claims,
      providerUid: idpId,
      // acr_values is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values,
      csrfToken,
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

    const { state, nonce } =
      await this.oidcClient.utils.buildAuthorizeParameters();

    const authorizeParams = {
      state,
      scope,
      idpId,
      // acr_values is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values,
      nonce,
      claims,
      // Prompt for the identity provider is forced here
      // and not linked to the prompt required of the service provider
      prompt: OidcProviderPrompt.LOGIN,
    };

    const authorizationUrl =
      await this.oidcClient.utils.getAuthorizeUrl(authorizeParams);

    const { name: idpName, title: idpLabel } =
      await this.identityProvider.getById(idpId);
    const session: OidcClientSession = {
      idpId,
      idpName,
      idpLabel,
      idpState: state,
      idpNonce: nonce,
    };

    await sessionOidc.set(session);

    this.logger.trace({
      route: OidcClientRoutes.REDIRECT_TO_IDP,
      method: 'POST',
      name: 'OidcClientRoutes.REDIRECT_TO_IDP',
      body,
      res,
      session,
      redirect: authorizationUrl,
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
  @Header('cache-control', 'public, max-age=600')
  async getWellKnownKeys() {
    this.logger.trace({
      route: OidcClientRoutes.WELL_KNOWN_KEYS,
      method: 'GET',
      name: 'OidcClientRoutes.WELL_KNOWN_KEYS',
    });
    return await this.oidcClient.utils.wellKnownKeys();
  }
}
