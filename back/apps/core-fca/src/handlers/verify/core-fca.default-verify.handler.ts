import { Injectable } from '@nestjs/common';

import { CryptographyFcaService, IAgentIdentity } from '@fc/cryptography-fca';
import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { LoggerService } from '@fc/logger-legacy';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionService } from '@fc/session';

import { CoreService } from '../../services';

@Injectable()
@FeatureHandler('core-fca-default-verify')
export class CoreFcaDefaultVerifyHandler implements IFeatureHandler {
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly logger: LoggerService,
    private readonly core: CoreService,
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
  async handle(sessionOidc: ISessionService<OidcClientSession>): Promise<void> {
    this.logger.debug('getConsent service: ##### core-fca-default-verify');

    const { idpId, idpIdentity, idpAcr, spId, spAcr, amr } =
      await sessionOidc.get();

    // Acr check
    this.core.checkIfAcrIsValid(idpAcr, spAcr);

    const agentIdentity = idpIdentity as unknown as IAgentIdentity;

    const agentHash = this.cryptographyFca.computeIdentityHash(
      idpId,
      agentIdentity,
    );

    await this.core.checkIfAccountIsBlocked(agentHash);

    const subSp = this.cryptographyFca.computeSubV1(spId, agentHash);
    const { sub: subIdp } = agentIdentity;

    // Save interaction to database & get sp's sub to avoid double computation
    const accountId = await this.core.computeInteraction(
      {
        spId,
        subSp,
        hashSp: agentHash,
      },
      {
        idpId,
        subIdp,
      },
    );

    const spIdentity = {
      ...idpIdentity,
      sub: subSp,
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
    };

    this.logger.trace({ session });

    await sessionOidc.set(session);
  }
}
