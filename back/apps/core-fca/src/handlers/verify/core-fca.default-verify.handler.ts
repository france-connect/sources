import { Injectable } from '@nestjs/common';

import { CoreService } from '@fc/core';
import { CryptographyFcaService, IAgentIdentity } from '@fc/cryptography-fca';
import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { LoggerService } from '@fc/logger';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionService } from '@fc/session';

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
   * The arguments sent to all FeatureHandler's handle() methods must be
   * typed by a interface exteded from `IFeatureHandler`
   * @see IVerifyFeatureHandlerHandleArgument as an exemple.
   * @todo #FC-487
   * @author Hugues
   * @date 2021-16-04
   */
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

    const { idpId, idpIdentity, idpAcr, spId, spAcr } = await sessionOidc.get();

    // Acr check
    this.core.checkIfAcrIsValid(idpAcr, spAcr);

    /**
     *  @todo
     *    author: Arnaud
     *    date: 09/04/2020
     *    ticket: FC-179
     *
     *    context: upgrade with session generic
     */
    const agentIdentity = idpIdentity as unknown as IAgentIdentity;

    const agentHash = this.cryptographyFca.computeIdentityHash(
      idpId,
      agentIdentity,
    );

    await this.core.checkIfAccountIsBlocked(agentHash);

    const subSp = this.cryptographyFca.computeSubV1(spId, agentHash);
    const { sub: subIdp } = agentIdentity;

    // Save interaction to database & get sp's sub to avoid double computation
    await this.core.computeInteraction(
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

    const spIdentity = { ...idpIdentity, sub: subSp };

    // Delete idp identity from volatile memory but keep the sub for the business logs.
    const idpIdentityCleaned = {
      sub: idpIdentity.sub,
    };

    await sessionOidc.set({
      idpIdentity: idpIdentityCleaned,
      spIdentity: spIdentity,
    });
  }
}
