import { Injectable } from '@nestjs/common';

import { AccountService } from '@fc/account';
import { ConfigService } from '@fc/config';
import { CoreAccountService, CoreAcrService } from '@fc/core';
import { CryptographyFcpService } from '@fc/cryptography-fcp';
import { FeatureHandler } from '@fc/feature-handler';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { OidcAcrService } from '@fc/oidc-acr';
import { OidcClientSession } from '@fc/oidc-client';
import { RnippService } from '@fc/rnipp';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { ISessionService } from '@fc/session';
import { TrackedEventInterface, TrackingService } from '@fc/tracking';

import { CoreFcpInvalidRepScopeException } from '../../exceptions';
import {
  IVerifyFeatureHandler,
  IVerifyFeatureHandlerHandleArgument,
} from '../../interfaces';
import { CoreFcpDefaultVerifyHandler } from './core-fcp-default-verify.handler';

@Injectable()
@FeatureHandler('core-fcp-aidants-connect-verify')
export class CoreFcpAidantsConnectVerifyHandler
  extends CoreFcpDefaultVerifyHandler
  implements IVerifyFeatureHandler
{
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    protected readonly logger: LoggerService,
    protected readonly coreAccount: CoreAccountService,
    protected readonly coreAcr: CoreAcrService,
    protected readonly config: ConfigService,
    protected readonly tracking: TrackingService,
    protected readonly rnipp: RnippService,
    protected readonly serviceProvider: ServiceProviderAdapterMongoService,
    protected readonly cryptographyFcp: CryptographyFcpService,
    protected readonly account: AccountService,
    protected readonly identityProvider: IdentityProviderAdapterMongoService,
    protected readonly oidcAcr: OidcAcrService,
  ) {
    super(
      logger,
      coreAccount,
      coreAcr,
      config,
      tracking,
      rnipp,
      serviceProvider,
      cryptographyFcp,
      account,
      identityProvider,
      oidcAcr,
    );
  }

  async handle({
    sessionOidc,
    trackingContext,
  }: IVerifyFeatureHandlerHandleArgument): Promise<void> {
    this.logger.debug(
      'getConsent service: ##### core-fcp-aidants-connect-verify',
    );

    const { spId, idpRepresentativeScope } = sessionOidc.get();

    const { rep_scope: spRepresentativeScope } =
      await this.serviceProvider.getById(spId);

    const { FC_INVALID_REP_SCOPE, FC_VALID_REP_SCOPE } =
      this.tracking.TrackedEventsMap;

    const hasMatchingRepScope = this.hasAtLeastOneMatchingRepresentativeScope(
      spRepresentativeScope,
      idpRepresentativeScope,
    );

    if (spRepresentativeScope.length > 0 && !hasMatchingRepScope) {
      /**
       * @todo #1741 Exceptions v2: Refonte structure des classes d'exception
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1741
       * @ticket FC-1741
       * @action Retrieve the rep_scope directly from the tracking configuration exception.
       */
      await this.setTrackEvent(
        sessionOidc,
        trackingContext,
        idpRepresentativeScope,
        FC_INVALID_REP_SCOPE,
      );

      throw new CoreFcpInvalidRepScopeException();
    }

    await this.setTrackEvent(
      sessionOidc,
      trackingContext,
      idpRepresentativeScope,
      FC_VALID_REP_SCOPE,
    );
  }

  private async setTrackEvent(
    sessionOidc: ISessionService<OidcClientSession>,
    trackingContext: Record<string, unknown>,
    idpRepresentativeScope: string[],
    trackEvent: TrackedEventInterface,
  ): Promise<void> {
    const trackingContextWithRepScope = {
      ...trackingContext,
      rep_scope: idpRepresentativeScope,
    };

    await this.tracking.track(trackEvent, trackingContextWithRepScope);

    await super.handle({
      sessionOidc,
      trackingContext: trackingContextWithRepScope,
    });
  }

  private hasAtLeastOneMatchingRepresentativeScope(
    spRepScopes: string[],
    idpRepScope: string[],
  ): boolean {
    return idpRepScope.some((scope) => spRepScopes.includes(scope));
  }
}
