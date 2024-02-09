import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';

import { IAuthorizationUrlFeatureHandlerArgument } from '../interfaces';

export const FCA_AUTHORIZATION_URL = 'fcaAuthorizationUrl';

@Injectable()
export class CoreFcaAuthorizationUrlService {
  constructor(public readonly moduleRef: ModuleRef) {}

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
    // login_hint is an oidc defined variable name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    login_hint,
  }: IAuthorizationUrlFeatureHandlerArgument) {
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
      // login_hint is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      login_hint,
    });
  }
}
