import { Request } from 'express';

import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import { CoreRoutes, ProcessCore } from '../enums';
import { CoreIdentityProviderNotFoundException } from '../exceptions';
import { IVerifyFeatureHandler } from '../interfaces';

@Injectable()
export class CoreVerifyService {
  constructor(
    protected readonly identityProvider: IdentityProviderAdapterMongoService,
    public readonly moduleRef: ModuleRef,
    protected readonly tracking: TrackingService,
  ) {}

  async getFeature<T extends IFeatureHandler>(
    idpId: string,
    process: ProcessCore,
  ): Promise<T> {
    const idp = await this.identityProvider.getById(idpId);

    if (!idp) {
      throw new CoreIdentityProviderNotFoundException();
    }

    const handlerClassName = idp.featureHandlers[process];

    return FeatureHandler.get<T>(handlerClassName, this);
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
    const { idpId } = sessionOidc.get();

    const verifyHandler = await this.getFeature<IVerifyFeatureHandler>(
      idpId,
      ProcessCore.CORE_VERIFY,
    );

    await verifyHandler.handle({ sessionOidc, trackingContext });
  }

  async handleUnavailableIdp(
    req: Request,
    params: {
      urlPrefix: string;
      interactionId: string;
      sessionOidc: ISessionService<OidcClientSession>;
    },
    idpDisabled: boolean,
  ): Promise<string> {
    const { interactionId, urlPrefix, sessionOidc } = params;

    const url = `${urlPrefix}${CoreRoutes.INTERACTION.replace(
      ':uid',
      interactionId,
    )}`;

    /**
     * Black listing redirects to idp choice,
     * thus we are no longer in an "sso" interaction,
     * so we update isSso flag in session.
     */
    sessionOidc.set('isSso', false);

    if (idpDisabled) {
      await this.trackIdpDisabled(req);
    } else {
      await this.trackIdpBlackListed(req);
    }

    return url;
  }

  async trackIdpBlackListed(req: Request) {
    const eventContext = { req };
    const { FC_IDP_BLACKLISTED } = this.tracking.TrackedEventsMap;

    await this.tracking.track(FC_IDP_BLACKLISTED, eventContext);
  }

  async trackIdpDisabled(req: Request) {
    const eventContext = { req };
    const { FC_IDP_DISABLED } = this.tracking.TrackedEventsMap;

    await this.tracking.track(FC_IDP_DISABLED, eventContext);
  }

  async trackVerified(req: Request) {
    const eventContext = { req };
    const { FC_VERIFIED } = this.tracking.TrackedEventsMap;

    await this.tracking.track(FC_VERIFIED, eventContext);
  }
}
