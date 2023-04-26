import { Injectable } from '@nestjs/common';

import { AccountBlockedException, AccountService } from '@fc/account';
import { PartialExcept, RequiredExcept } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CoreAccountService, CoreAcrService } from '@fc/core';
import { CryptographyFcpService } from '@fc/cryptography-fcp';
import { FeatureHandler } from '@fc/feature-handler';
import { LoggerService } from '@fc/logger-legacy';
import { IOidcIdentity } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import { RnippPivotIdentity, RnippService } from '@fc/rnipp';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { TrackingService } from '@fc/tracking';

import { CoreConfig } from '../../dto';
import { IdentitySource } from '../../enums';
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
    private readonly coreAccount: CoreAccountService,
    private readonly coreAcr: CoreAcrService,
    private readonly config: ConfigService,
    private readonly tracking: TrackingService,
    private readonly rnipp: RnippService,
    private readonly serviceProvider: ServiceProviderAdapterMongoService,
    private readonly cryptographyFcp: CryptographyFcpService,
    private readonly account: AccountService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Main business manipulations occurs in this method
   *
   * 1. Get infos on current interaction and identity fetched from IdP
   * 2. Check identity against RNIPP
   * 3. Store interaction with account service (long term storage)
   * 4. Find which identity should be sent to the Sp (either Rnipp or IdP)
   * 5. Store identity with session service (short term storage)
   * 6. Display consent page
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
    this.coreAcr.checkIfAcrIsValid(idpAcr, spAcr);

    // Identity check and normalization
    const rnippIdentity = await this.rnippCheck(
      idpIdentity as IOidcIdentity,
      trackingContext,
    );

    const { entityId } = await this.serviceProvider.getById(spId);

    const hashSp = this.cryptographyFcp.computeIdentityHash(rnippIdentity);

    const account = await this.account.getAccountByIdentityHash(hashSp);

    if (account.active === false) {
      throw new AccountBlockedException();
    }

    let subSp: string;

    if (account.spFederation?.hasOwnProperty(entityId)) {
      this.logger.trace('using existing sub from spFederation');
      subSp = account.spFederation[entityId].sub;
    } else {
      this.logger.trace('creating new sub');
      subSp = this.cryptographyFcp.computeSubV1(entityId, hashSp);
    }

    const idpIdentityHash = this.cryptographyFcp.computeIdentityHash(
      idpIdentity as IOidcIdentity,
    );
    const subIdp = this.cryptographyFcp.computeSubV1(spId, idpIdentityHash);

    // Save interaction to database & get sp's sub to avoid double computation
    const accountId = await this.coreAccount.computeFederation(
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

    const spIdentity = this.buildSpIdentity(subSp, idpIdentity, rnippIdentity);

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
      'sub' | 'email' | 'preferred_username'
    >,
    trackingContext: any,
  ): Promise<RnippPivotIdentity> {
    const { FC_REQUESTED_RNIPP, FC_RECEIVED_VALID_RNIPP } =
      this.tracking.TrackedEventsMap;

    this.tracking.track(FC_REQUESTED_RNIPP, trackingContext);
    const rnippIdentity = await this.rnipp.check(idpIdentity);
    this.tracking.track(FC_RECEIVED_VALID_RNIPP, trackingContext);

    this.logger.trace({ rnippIdentity });

    return rnippIdentity;
  }

  private buildRnippClaims(
    rnippIdentity: RnippPivotIdentity,
  ): Partial<RnippPivotIdentity> {
    const rnippClaims = Object.fromEntries(
      Object.entries(rnippIdentity).map(([key, value]) => [
        `rnipp_${key}`,
        value,
      ]),
    );

    return rnippClaims;
  }

  private buildSpIdentity(
    subSp: string,
    idpIdentity: PartialExcept<IOidcIdentity, 'sub'>,
    rnippIdentity: RnippPivotIdentity,
  ): PartialExcept<IOidcIdentity, 'sub'> {
    const { useIdentityFrom } = this.config.get<CoreConfig>('Core');

    switch (useIdentityFrom) {
      case IdentitySource.RNIPP:
        return this.buildFromRnippIdentity(subSp, rnippIdentity, idpIdentity);
      case IdentitySource.IDP:
        return this.buildFromIdpIdentity(subSp, idpIdentity, rnippIdentity);
    }
  }

  /**
   * For Sp to handle properly users with birthdate as YYYY-MM or YYYY
   * we need to provide the idp birthdate not completed with "01" by default
   */
  private buildFromRnippIdentity(
    subSp: string,
    rnippIdentity: RnippPivotIdentity,
    idpIdentity: PartialExcept<IOidcIdentity, 'sub'>,
  ): PartialExcept<IOidcIdentity, 'sub'> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { birthdate, email, preferred_username } = idpIdentity;
    return {
      ...rnippIdentity,
      // oidc claim
      // eslint-disable-next-line @typescript-eslint/naming-convention
      idp_birthdate: birthdate,
      sub: subSp,
      email: email,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      preferred_username: preferred_username,
    };
  }

  private buildFromIdpIdentity(
    subSp: string,
    idpIdentity: PartialExcept<IOidcIdentity, 'sub'>,
    rnippIdentity: RnippPivotIdentity,
  ): PartialExcept<IOidcIdentity, 'sub'> {
    const rnippClaims: Partial<RnippPivotIdentity> =
      this.buildRnippClaims(rnippIdentity);

    /**
     * Prepare identity that will be retrieved by `oidc-provider`
     * and sent to the SP
     *
     * We need to replace IdP's sub, by our own sub
     */
    // oidc claim
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { given_name_array } = rnippIdentity;
    return {
      ...idpIdentity,
      ...rnippClaims,
      // oidc claims
      // eslint-disable-next-line @typescript-eslint/naming-convention
      given_name_array,
      sub: subSp,
    };
  }
}
