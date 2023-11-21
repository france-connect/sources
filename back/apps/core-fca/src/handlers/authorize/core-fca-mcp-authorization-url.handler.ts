import { Injectable } from '@nestjs/common';

import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { LoggerService } from '@fc/logger-legacy';

import { CoreFcaDefaultAuthorizationHandler } from './core-fca-default-authorization-url.handler';

export const PUBLICNESS_SCOPE_NAME = 'is_service_public';

@Injectable()
@FeatureHandler('core-fca-mcp-authorization-url')
export class CoreFcaMcpAuthorizationHandler
  extends CoreFcaDefaultAuthorizationHandler
  implements IFeatureHandler
{
  constructor(protected readonly logger: LoggerService) {
    super(logger);
  }

  getAuthorizeParams(config: {
    state: string;
    scope: string;
    idpId: string;
    // acr_values is an oidc defined variable name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    acr_values: string;
    nonce: string;
  }) {
    return {
      state: config.state,
      scope: this.handleScopePublicness(config.scope),
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

  /**
   * Always add PUBLICNESS_SCOPE_NAME except when already in scope
   */
  private handleScopePublicness(scope: string): string {
    const scopeList = scope.split(' ');
    if (scopeList.includes(PUBLICNESS_SCOPE_NAME)) return scope;
    scopeList.push(PUBLICNESS_SCOPE_NAME);
    return scopeList.join(' ');
  }
}
