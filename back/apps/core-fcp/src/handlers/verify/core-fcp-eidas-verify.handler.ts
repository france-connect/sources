import { Injectable } from '@nestjs/common';

import { CoreAccountService, CoreAcrService } from '@fc/core';
import { CryptographyEidasService } from '@fc/cryptography-eidas';
import { FeatureHandler } from '@fc/feature-handler';
import { I18nService } from '@fc/i18n';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { IOidcIdentity } from '@fc/oidc';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';

import {
  IVerifyFeatureHandler,
  IVerifyFeatureHandlerHandleArgument,
} from '../../interfaces';

@Injectable()
@FeatureHandler('core-fcp-eidas-verify')
export class CoreFcpEidasVerifyHandler implements IVerifyFeatureHandler {
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly logger: LoggerService,
    private readonly coreAcount: CoreAccountService,
    private readonly coreAcr: CoreAcrService,
    private readonly serviceProvider: ServiceProviderAdapterMongoService,
    private readonly cryptographyEidas: CryptographyEidasService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
    private readonly i18n: I18nService,
  ) {}

  async handle({
    sessionOidc,
  }: IVerifyFeatureHandlerHandleArgument): Promise<void> {
    this.logger.debug('getConsent service: ##### core-fcp-eidas-verify ');

    // Grab informations on interaction and identity
    const { idpId, idpIdentity, idpAcr, spId, spAcr, subs } = sessionOidc.get();
    const { entityId } = await this.serviceProvider.getById(spId);

    // Acr check
    const { maxAuthorizedAcr } = await this.identityProvider.getById(idpId);

    this.coreAcr.checkIfAcrIsValid(idpAcr, spAcr, maxAuthorizedAcr);

    const identityHash = this.cryptographyEidas.computeIdentityHash(
      idpIdentity as IOidcIdentity,
    );
    const sub = this.cryptographyEidas.computeSubV1(entityId, identityHash);

    // Save interaction to database
    const accountId = await this.coreAcount.computeFederation({
      key: entityId,
      sub,
      identityHash,
    });

    /**
     * Prepare identity that will be retrieved by `oidc-provider`
     * and sent to the SP
     *
     * We need to replace IdP's sub, by our own sub
     */
    const { sub: _sub, ...spIdentityCleaned } = idpIdentity;

    // Delete idp identity from volatile memory but keep the sub for the business logs.
    const idpIdentityCleaned = { sub: idpIdentity.sub };
    const technicalClaims = this.getTechnicalClaims(idpId);

    sessionOidc.set({
      idpIdentity: idpIdentityCleaned,
      spIdentity: {
        ...spIdentityCleaned,
        ...technicalClaims,
      },
      accountId,
      subs: { ...subs, [spId]: sub },
    });

    // Force language to be en-GB when coming from eIDAS bridge
    this.i18n.setSessionLanguage('en-GB');
  }

  private getTechnicalClaims(idpId: string): Record<string, unknown> {
    return {
      // OIDC fashion naming
      // eslint-disable-next-line @typescript-eslint/naming-convention
      idp_id: idpId,
    };
  }
}
