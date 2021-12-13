import { Injectable } from '@nestjs/common';

import { CoreService } from '@fc/core';
import { CryptographyEidasService } from '@fc/cryptography-eidas';
import { FeatureHandler } from '@fc/feature-handler';
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
    private readonly core: CoreService,
    private readonly serviceProvider: ServiceProviderAdapterMongoService,
    private readonly cryptographyEidas: CryptographyEidasService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async handle({
    sessionOidc,
  }: IVerifyFeatureHandlerHandleArgument): Promise<void> {
    this.logger.debug('getConsent service: ##### core-fcp-eidas-verify ');

    // Grab informations on interaction and identity
    const { idpId, idpIdentity, idpAcr, spId, spAcr } = await sessionOidc.get();
    const { entityId } = await this.serviceProvider.getById(spId);

    // Acr check
    this.core.checkIfAcrIsValid(idpAcr, spAcr);

    // as spIdentity = idpIdentity, hashSp = hashIdp and is used to generate both sub
    const hashSp = this.cryptographyEidas.computeIdentityHash(
      idpIdentity as IOidcIdentity,
    );
    const subSp = this.cryptographyEidas.computeSubV1(entityId, hashSp);
    const subIdp = this.cryptographyEidas.computeSubV1(spId, hashSp);

    // Save interaction to database
    const accountId = await this.core.computeInteraction(
      {
        spId,
        entityId,
        subSp,
        hashSp,
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
    const spIdentityCleaned = { ...idpIdentity, sub: subSp };

    // Delete idp identity from volatile memory but keep the sub for the business logs.
    const idpIdentityCleaned = { sub: idpIdentity.sub };

    await sessionOidc.set({
      amr: ['eidas'],
      idpIdentity: idpIdentityCleaned,
      spIdentity: spIdentityCleaned,
      accountId,
    });
  }
}
