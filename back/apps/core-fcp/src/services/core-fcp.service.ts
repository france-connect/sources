import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { CoreMissingAuthenticationEmailException } from '@fc/core';
import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import { OidcSession } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import { IClaim, IRichClaim, ScopesService } from '@fc/scopes';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { ISessionService } from '@fc/session';

import { ProcessCore } from '../enums';
import { CoreFcpSendEmailHandler } from '../handlers';
import { IVerifyFeatureHandler } from '../interfaces';

@Injectable()
export class CoreFcpService {
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
    public readonly moduleRef: ModuleRef,
    private readonly scopes: ScopesService,
    private readonly serviceProvider: ServiceProviderAdapterMongoService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Main business manipulations occurs in this method
   *
   * @param {ISessionService<OidcClientSession>} sessionOidc
   * @returns {Promise<void>}
   */
  async verify(
    sessionOidc: ISessionService<OidcClientSession>,
    trackingContext: Record<string, unknown>,
  ): Promise<void> {
    this.logger.debug('CoreFcpService.verify');

    const { idpId } = await sessionOidc.get();

    const verifyHandler = await this.getFeature<IVerifyFeatureHandler>(
      idpId,
      ProcessCore.CORE_VERIFY,
    );

    this.logger.trace({ idpId, trackingContext });

    return await verifyHandler.handle({ sessionOidc, trackingContext });
  }

  async getFeature<T extends IFeatureHandler>(
    idpId: string,
    process: ProcessCore,
  ): Promise<T> {
    this.logger.debug(`getFeature ${process} for provider: ${idpId}`);

    const idp = await this.identityProvider.getById(idpId);
    const idClass = idp.featureHandlers[process];

    this.logger.trace({ idp, idClass });

    return FeatureHandler.get<T>(idClass, this);
  }

  /**
   * Send an email to the authenticated end-user after consent.
   *
   * @param {ISessionService<OidcClientSession>} sessionOidc
   * @returns {Promise<void>}
   */
  async sendAuthenticationMail(session: OidcSession): Promise<void> {
    this.logger.debug('CoreFcpService.sendAuthenticationMail()');

    const { idpId } = session;
    const idp = await this.identityProvider.getById(idpId);

    let handler: CoreFcpSendEmailHandler;
    try {
      const { authenticationEmail } = idp.featureHandlers;
      handler = await FeatureHandler.get<CoreFcpSendEmailHandler>(
        authenticationEmail,
        this,
      );
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      throw new CoreMissingAuthenticationEmailException();
    }

    this.logger.trace({ idpId, idp });

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

  /**
   * @todo #1023 je type les entr??es et sortie correctement et non pas avec any
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
   * @todo #1023 je type les entr??es et sortie correctement et non pas avec any
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
   * @todo #1023 je type les entr??es et sortie correctement et non pas avec any
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
