import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { LoggerService } from '@fc/logger-legacy';

import { IAuthorizationUrlServiceGetAuhtorizeArgument } from '../interfaces/authorization-url-feature-handler.interface';

export const FCA_AUTHORIZATION_URL = 'fcaAuthorizationUrl';

@Injectable()
export class CoreFcaAuthorizationUrlService {
  constructor(
    private readonly logger: LoggerService,
    public readonly moduleRef: ModuleRef,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  getAuthorizeUrl<T extends IFeatureHandler>({
    oidcClient,
    state,
    scope,
    idpId,
    idpFeatureHandlers,
    // acr_values is an oidc defined variable name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    acr_values,
    nonce,
    spId,
  }: IAuthorizationUrlServiceGetAuhtorizeArgument) {
    const idClass = idpFeatureHandlers[FCA_AUTHORIZATION_URL];
    const authorizationUrlhandler = FeatureHandler.get<T>(idClass, {
      moduleRef: this.moduleRef,
    });

    return authorizationUrlhandler.handle({
      oidcClient,
      state,
      scope,
      idpId,
      // acr_values is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values,
      nonce,
      spId,
    });
  }
}
