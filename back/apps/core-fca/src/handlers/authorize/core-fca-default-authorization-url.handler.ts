import { Injectable } from '@nestjs/common';

import { IAuthorizationUrlFeatureHandlerHandleArgument } from '@fc/core-fca/interfaces';
import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { LoggerService } from '@fc/logger-legacy';

@Injectable()
@FeatureHandler('core-fca-default-authorization-url')
export class CoreFcaDefaultAuthorizationHandler implements IFeatureHandler {
  constructor(protected readonly logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }

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
  }: IAuthorizationUrlFeatureHandlerHandleArgument): Promise<string> {
    this.logger.debug(
      'getAuthorizeParams service: ##### core-fca-default-authorize',
    );

    const authorizationUrlRaw = await oidcClient.utils.getAuthorizeUrl(
      this.getAuthorizeParams({
        state,
        scope,
        idpId,
        // acr_values is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values,
        nonce,
      }),
    );

    let authorizationUrl = authorizationUrlRaw;
    if (spId) {
      authorizationUrl = this.appendSpIdToAuthorizeUrl(
        spId,
        authorizationUrlRaw,
      );
    }

    return authorizationUrl;
  }

  /**
   * Append the sp_id query param to the authorize url
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/475
   *
   * @param serviceProviderId The client_id of the SP
   * @param authorizationUrl The authorization url built by the library oidc-client
   * @returns The final url
   */
  protected appendSpIdToAuthorizeUrl(
    serviceProviderId: string,
    authorizationUrl: string,
  ): string {
    return `${authorizationUrl}&sp_id=${serviceProviderId}`;
  }

  protected getAuthorizeParams(config: {
    state: string;
    scope: string;
    idpId: string;
    // acr_values is an oidc defined variable name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    acr_values: string;
    nonce: string;
  }): {
    state: string;
    scope: string;
    idpId: string;
    // acr_values is an oidc defined variable name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    acr_values: string;
    nonce: string;
    claims: string;
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
    };
  }
}
