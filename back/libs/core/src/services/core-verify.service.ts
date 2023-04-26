import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger-legacy';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionService } from '@fc/session';
import { TrackedEventContextInterface } from '@fc/tracking';

import { ProcessCore } from '../enums';
import { CoreIdentityProviderNotFoundException } from '../exceptions';
import { IVerifyFeatureHandler } from '../interfaces';

@Injectable()
export class CoreVerifyService {
  constructor(
    private readonly logger: LoggerService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
    public readonly moduleRef: ModuleRef,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async getFeature<T extends IFeatureHandler>(
    idpId: string,
    process: ProcessCore,
  ): Promise<T> {
    this.logger.debug(`getFeature ${process} for provider: ${idpId}`);

    const idp = await this.identityProvider.getById(idpId);

    if (!idp) {
      throw new CoreIdentityProviderNotFoundException();
    }

    const idClass = idp.featureHandlers[process];

    this.logger.trace({ idp, idClass });

    return FeatureHandler.get<T>(idClass, this);
  }

  /**
   * Main business manipulations occurs in this method
   *
   * @param req
   */
  async verify(
    sessionOidc: ISessionService<OidcClientSession>,
    trackingContext: TrackedEventContextInterface,
  ): Promise<void> {
    const { idpId } = await sessionOidc.get();

    const verifyHandler = await this.getFeature<IVerifyFeatureHandler>(
      idpId,
      ProcessCore.CORE_VERIFY,
    );

    await verifyHandler.handle({ sessionOidc, trackingContext });
  }
}
