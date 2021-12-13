import { Injectable } from '@nestjs/common';

import { RequiredExcept } from '@fc/common';
import { CoreService } from '@fc/core';
import { CryptographyFcpService } from '@fc/cryptography-fcp';
import { FeatureHandler } from '@fc/feature-handler';
import { LoggerService } from '@fc/logger';
import { IOidcIdentity } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import {
  RnippPivotIdentity,
  RnippReceivedValidEvent,
  RnippRequestedEvent,
  RnippService,
} from '@fc/rnipp';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { TrackingService } from '@fc/tracking';

import {
  IVerifyFeatureHandler,
  IVerifyFeatureHandlerHandleArgument,
} from '../../interfaces';

@Injectable()
@FeatureHandler('core-fcp-default-verify')
export class CoreFcpDefaultVerifyHandler implements IVerifyFeatureHandler {
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly logger: LoggerService,
    private readonly core: CoreService,
    private readonly tracking: TrackingService,
    private readonly rnipp: RnippService,
    private readonly serviceProvider: ServiceProviderAdapterMongoService,
    private readonly cryptographyFcp: CryptographyFcpService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Main business manipulations occurs in this method
   *
   * 1. Get infos on current interaction and identity fetched from IdP
   * 2. Check identity against RNIPP
   * 3. Store interaction with account service (long term storage)
   * 4. Store identity with session service (short term storage)
   * 5. Display consent page
   *
   * NB:
   * Identity from identity provider id transmitted to sp.
   *   This is not complient with core v1 / eIDAS low.
   *   We'll see if we make this configurable when we implement low,
   *   `rnippIdentity` is at hand anyway.
   *
   * @param req
   */
  async handle({
    sessionOidc,
    trackingContext,
  }: IVerifyFeatureHandlerHandleArgument): Promise<void> {
    this.logger.debug('getConsent service: ##### core-fcp-default-verify');

    // Grab informations on interaction and identity
    const { idpAcr, idpId, idpIdentity, spAcr, spId } = await sessionOidc.get();

    /**
     * @todo #410 - le DTO est permissif et devrait forcer les données
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/410
     * if (!idpId || !idpIdentity) {
     *   throw new CoreMissingInteraction('identity provider');
     * }
     * if (!spIdentity || !spId) {
     *   throw new CoreMissingInteraction('service provider');
     * }
     */

    // Acr check
    this.core.checkIfAcrIsValid(idpAcr, spAcr);

    // Identity check and normalization
    const rnippIdentity = await this.rnippCheck(
      idpIdentity as IOidcIdentity,
      trackingContext,
    );

    const { entityId } = await this.serviceProvider.getById(spId);

    const hashSp = this.cryptographyFcp.computeIdentityHash(rnippIdentity);

    await this.core.checkIfAccountIsBlocked(hashSp);

    const subSp = this.cryptographyFcp.computeSubV1(entityId, hashSp);
    const idpIdentityHash = this.cryptographyFcp.computeIdentityHash(
      idpIdentity as IOidcIdentity,
    );
    const subIdp = this.cryptographyFcp.computeSubV1(spId, idpIdentityHash);

    // Save interaction to database & get sp's sub to avoid double computation
    const accountId = await this.core.computeInteraction(
      {
        entityId,
        hashSp,
        spId,
        subSp,
      },
      {
        idpId,
        subIdp,
      },
    );

    /**
     * Prepare identity that will be retrieved by `oidc-provider`
     * and sent to the SP
     *
     * We need to replace IdP's sub, by our own sub
     */
    const spIdentity = { ...idpIdentity, sub: subSp };

    // Delete idp identity from volatile memory but keep the sub for the business logs.
    const idpIdentityCleaned = { sub: idpIdentity.sub };
    const session: OidcClientSession = {
      amr: ['fc'],
      idpIdentity: idpIdentityCleaned,
      spIdentity,
      accountId,
    };

    this.logger.trace({ session });

    await sessionOidc.set(session);
  }

  /**
   *
   * @param idpIdentity
   * @param req
   */
  private async rnippCheck(
    idpIdentity: RequiredExcept<
      IOidcIdentity,
      'sub' | 'email' | 'phone_number' | 'preferred_username'
    >,
    trackingContext: any,
  ): Promise<RnippPivotIdentity> {
    this.tracking.track(RnippRequestedEvent, trackingContext);
    const rnippIdentity = await this.rnipp.check(idpIdentity);
    this.tracking.track(RnippReceivedValidEvent, trackingContext);

    this.logger.trace({ rnippIdentity });

    return rnippIdentity;
  }
}
