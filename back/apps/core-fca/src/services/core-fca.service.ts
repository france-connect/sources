import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { FeatureHandler } from '@fc/feature-handler';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionService } from '@fc/session';

@Injectable()
export class CoreFcaService {
  constructor(
    private readonly logger: LoggerService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
    public moduleRef: ModuleRef,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Main business manipulations occurs in this method
   *
   * @param req
   */
  async verify(sessionOidc: ISessionService<OidcClientSession>): Promise<void> {
    this.logger.debug('getConsent service');

    const { idpId } = await sessionOidc.get();
    const idp = await this.identityProvider.getById(idpId);
    const { coreVerify } = idp.featureHandlers;

    const handler = await FeatureHandler.get(coreVerify, this);
    await handler.handle(sessionOidc);
  }
}
