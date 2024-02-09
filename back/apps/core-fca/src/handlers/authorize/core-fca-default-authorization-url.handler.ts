import { Injectable } from '@nestjs/common';

import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { LoggerService } from '@fc/logger';

import { AuthorizeParamsKeys } from '../../enums';
import { IAuthorizationUrlArgument } from '../../interfaces';

@Injectable()
@FeatureHandler('core-fca-default-authorization-url')
export class CoreFcaDefaultAuthorizationHandler implements IFeatureHandler {
  constructor(protected readonly logger: LoggerService) {}

  async handle({
    oidcClient,
    state,
    scope,
    idpId,
    // acr_values is an oidc defined variable name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    acr_values,
    nonce,
    spId,
    // login_hint is an oidc defined variable name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    login_hint,
  }: IAuthorizationUrlArgument): Promise<string> {
    this.logger.debug(
      'getAuthorizeParams service: ##### core-fca-default-authorize',
    );

    let authorizationUrl = await oidcClient.utils.getAuthorizeUrl(
      this.getAuthorizeParams({
        state,
        scope,
        idpId,
        // acr_values is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values,
        nonce,
        // login_hint is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        login_hint,
      }),
    );

    if (spId) {
      this.logger.debug(`Found "${spId}" to append to authorize url`);
      /**
       * Append the sp_id query param to the authorize url
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/475
       *
       * @param serviceProviderId The client_id of the SP
       * @param authorizationUrl The authorization url built by the library oidc-client
       * @returns The computed url with sp
       */
      authorizationUrl = this.appendParamToAuthorizeUrl(
        AuthorizeParamsKeys.SP_ID,
        spId,
        authorizationUrl,
      );
    }

    // login_hint is an oidc defined variable name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    if (login_hint) {
      this.logger.debug(`Found "${login_hint}" to append to authorize url`);
      authorizationUrl = this.appendParamToAuthorizeUrl(
        AuthorizeParamsKeys.LOGIN_HINT,
        // login_hint is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        login_hint,
        authorizationUrl,
      );
    }

    return authorizationUrl;
  }

  protected appendParamToAuthorizeUrl(
    paramKey: AuthorizeParamsKeys,
    paramValue: string,
    authorizationUrl: string,
  ): string {
    return `${authorizationUrl}&${paramKey}=${encodeURIComponent(paramValue)}`;
  }

  protected getAuthorizeParams(config: {
    state: string;
    scope: string;
    idpId: string;
    // acr_values is an oidc defined variable name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    acr_values: string;
    nonce: string;
    // login_hint is an oidc defined variable name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    login_hint?: string;
  }): {
    state: string;
    scope: string;
    idpId: string;
    // acr_values is an oidc defined variable name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    acr_values: string;
    nonce: string;
    claims: string;
    // login_hint is an oidc defined variable name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    login_hint?: string;
  } {
    return {
      state: config.state,
      scope: config.scope,
      idpId: config.idpId,
      // acr_values is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: config.acr_values,
      nonce: config.nonce,
      /**
       * @todo #1021 Récupérer la vraie valeur du claims envoyé par le FS
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1021
       * @ticket FC-1021
       */
      claims: '{"id_token":{"amr":{"essential":true}}}',
      // login_hint is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      login_hint: config.login_hint,
    };
  }
}
