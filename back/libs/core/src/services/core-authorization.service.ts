import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { AuthorizationParameters, OidcClientService } from '@fc/oidc-client';

export const CORE_AUTHORIZATION_FEATURE = 'coreAuthorization';

@Injectable()
export class CoreAuthorizationService {
  constructor(
    private readonly logger: LoggerService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
    private readonly oidcClient: OidcClientService,
    private readonly moduleRef: ModuleRef,
  ) {}

  async getAuthorizeUrl(idpId: string, parameters: AuthorizationParameters) {
    const { title: idpLabel, featureHandlers: idpFeatureHandlers } =
      await this.identityProvider.getById(idpId);

    const handlerClassName = idpFeatureHandlers[CORE_AUTHORIZATION_FEATURE];
    this.logger.debug(
      parameters,
      `Calling "${handlerClassName}" feature handler for idp "${idpLabel}" (${idpId}) with base authorization parameters`,
    );
    const authorizationHandler = FeatureHandler.get<
      IFeatureHandler<AuthorizationParameters, AuthorizationParameters>
    >(handlerClassName, {
      moduleRef: this.moduleRef,
    });

    const allParams = await authorizationHandler.handle(parameters);

    this.logger.debug(
      allParams,
      `Got final authorization parameters from "${handlerClassName}" feature handler for idp "${idpLabel}" (${idpId})`,
    );

    const authorizeUrl = await this.oidcClient.utils.getAuthorizeUrl(
      idpId,
      allParams,
    );

    this.logger.debug(
      `Final authorize url for idp "${idpLabel}" (${idpId}): ${authorizeUrl}`,
    );
    return authorizeUrl;
  }
}
