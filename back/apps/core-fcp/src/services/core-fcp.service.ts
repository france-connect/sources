import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { ConfigService } from '@fc/config';
import { FeatureHandler } from '@fc/feature-handler';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger-legacy';
import { OidcSession } from '@fc/oidc';
import { OidcAcrService } from '@fc/oidc-acr';
import { IClaim, IRichClaim, ScopesService } from '@fc/scopes';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { ISessionService } from '@fc/session';

import { AppConfig, CoreSessionDto } from '../dto';
import { CoreFcpSendEmailHandler } from '../handlers';

@Injectable()
export class CoreFcpService {
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
    public readonly moduleRef: ModuleRef,
    private readonly scopes: ScopesService,
    private readonly serviceProvider: ServiceProviderAdapterMongoService,
    private readonly oidcAcr: OidcAcrService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Send an email to the authenticated end-user after consent.
   *
   * @param {ISessionService<OidcClientSession>} sessionOidc
   * @returns {Promise<void>}
   */
  async sendAuthenticationMail(
    session: OidcSession,
    sessionCore: ISessionService<CoreSessionDto>,
  ): Promise<void> {
    this.logger.debug('CoreFcpService.sendAuthenticationMail()');

    const { sentNotificationsForSp } = await sessionCore.get();
    const { idpId, spId } = session;
    const idp = await this.identityProvider.getById(idpId);

    this.logger.trace({ idpId, idp });

    const { authenticationEmail } = idp.featureHandlers;
    const handler = FeatureHandler.get<CoreFcpSendEmailHandler>(
      authenticationEmail,
      this,
    );

    // notification already sent for this service provider during this session
    if (sentNotificationsForSp.includes(spId)) {
      return;
    }

    // update the session to take into account the notification for this service provider
    sentNotificationsForSp.push(spId);
    await sessionCore.set('sentNotificationsForSp', sentNotificationsForSp);

    await handler.handle(session);
  }

  async isConsentRequired(spId: string): Promise<boolean> {
    const { type, identityConsent } = await this.serviceProvider.getById(spId);

    const consentRequired = this.serviceProvider.consentRequired(
      type,
      identityConsent,
    );

    this.logger.trace({ consentRequired });

    return consentRequired;
  }

  isInsufficientAcrLevel(acrValue: string, isSuspicious: boolean) {
    const { minAcrForContextRequest } = this.config.get<AppConfig>('App');

    const insufficientAcrLevel = !this.oidcAcr.isAcrValid(
      acrValue,
      minAcrForContextRequest,
    );

    return isSuspicious && insufficientAcrLevel;
  }

  /**
   * @todo #1023 je type les entrées et sortie correctement et non pas avec any
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1023
   * @ticket #FC-1023
   */
  getClaimsLabelsForInteraction(interaction: any): IRichClaim[] {
    const scopes = this.getScopesForInteraction(interaction);

    const claims = this.scopes.getRichClaimsFromScopes(scopes);

    this.logger.trace({ interaction, claims });

    return claims;
  }

  /**
   * @todo #1023 je type les entrées et sortie correctement et non pas avec any
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1023
   * @ticket #FC-1023
   */
  getClaimsForInteraction(interaction: any): IClaim[] {
    const scopes = this.getScopesForInteraction(interaction);

    const claims = this.scopes.getRawClaimsFromScopes(scopes);

    this.logger.trace({ interaction, claims });

    return claims;
  }

  /**
   * @todo #1023 je type les entrées et sortie correctement et non pas avec any
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1023
   * @ticket #FC-1023
   */
  getScopesForInteraction(interaction: any): string[] {
    const {
      params: { scope },
    } = interaction;
    const scopes = scope.split(' ');

    this.logger.trace({ interaction, scopes });

    return scopes;
  }
}
