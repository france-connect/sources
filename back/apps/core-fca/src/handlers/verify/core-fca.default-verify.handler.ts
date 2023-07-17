import { Injectable } from '@nestjs/common';

import {
  CoreAccountService,
  CoreAcrService,
  IVerifyFeatureHandlerHandleArgument,
} from '@fc/core';
import { CryptographyFcaService, IAgentIdentity } from '@fc/cryptography-fca';
import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { LoggerService } from '@fc/logger-legacy';
import { OidcClientSession } from '@fc/oidc-client';

@Injectable()
@FeatureHandler('core-fca-default-verify')
export class CoreFcaDefaultVerifyHandler implements IFeatureHandler {
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly logger: LoggerService,
    private readonly coreAccount: CoreAccountService,
    private readonly coreAcr: CoreAcrService,
    private readonly cryptographyFca: CryptographyFcaService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Main business manipulations occurs in this method
   *
   * 1. Get infos on current interaction and identity fetched from IdP
   * 2. Store interaction with account service (long term storage)
   * 3. Store identity with session service (short term storage)
   * 4. Display consent page
   *
   * @param req
   */
  async handle({
    sessionOidc,
  }: IVerifyFeatureHandlerHandleArgument): Promise<void> {
    this.logger.debug('getConsent service: ##### core-fca-default-verify');

    const { idpId, idpIdentity, idpAcr, spId, spAcr, amr, subs } =
      await sessionOidc.get();

    // Acr check
    this.coreAcr.checkIfAcrIsValid(idpAcr, spAcr);

    const agentIdentity = idpIdentity as unknown as IAgentIdentity;

    const agentHash = this.cryptographyFca.computeIdentityHash(
      idpId,
      agentIdentity,
    );

    await this.coreAccount.checkIfAccountIsBlocked(agentHash);

    const sub = this.cryptographyFca.computeSubV1(spId, agentHash);

    // Save interaction to database & get sp's sub to avoid double computation
    const accountId = await this.coreAccount.computeFederation({
      key: spId,
      sub,
      identityHash: agentHash,
    });

    const { sub: _sub, ...spIdentityCleaned } = idpIdentity;

    const spIdentity = {
      ...spIdentityCleaned,
      // AgentConnect claims naming convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      idp_id: idpId,
      // AgentConnect claims naming convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      idp_acr: idpAcr,
    };

    const session: OidcClientSession = {
      amr,
      idpIdentity,
      spIdentity,
      accountId,
      subs: { ...subs, [spId]: sub },
    };

    this.logger.trace({ session });

    await sessionOidc.set(session);
  }
}
