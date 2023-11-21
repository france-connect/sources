import { Injectable } from '@nestjs/common';

import {
  CoreAccountService,
  CoreAcrService,
  IVerifyFeatureHandlerHandleArgument,
} from '@fc/core';
import { CoreFcaAgentNotFromPublicServiceException } from '@fc/core-fca/exceptions';
import { CryptographyFcaService } from '@fc/cryptography-fca';
import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { LoggerService } from '@fc/logger-legacy';

import { IAgentConnectOidcIdentity } from '../../interfaces';
import { CoreFcaDefaultVerifyHandler } from './core-fca.default-verify.handler';

@Injectable()
@FeatureHandler('core-fca-mcp-verify')
export class CoreFcaMcpVerifyHandler
  extends CoreFcaDefaultVerifyHandler
  implements IFeatureHandler
{
  constructor(
    protected readonly logger: LoggerService,
    protected readonly coreAccount: CoreAccountService,
    protected readonly coreAcr: CoreAcrService,
    protected readonly cryptographyFca: CryptographyFcaService,
  ) {
    super(logger, coreAccount, coreAcr, cryptographyFca);
  }

  /**
   * Main business manipulations occurs in this method
   *
   * 1. Get infos on current interaction and identity fetched from IdP
   * 2. Store interaction with account service (long term storage)
   * 3. Store identity with session service (short term storage)
   *
   * @param req
   */
  async handle({
    sessionOidc,
  }: IVerifyFeatureHandlerHandleArgument): Promise<void> {
    this.logger.debug('verifyIdentity service: ##### core-fca-default-verify');

    const { idpId, idpIdentity, idpAcr, spId, spAcr } = await sessionOidc.get();

    // for mcp, we check is_service_public
    // only is_service_public true can be verified with mcp idp
    if ((idpIdentity as IAgentConnectOidcIdentity).is_service_public !== true) {
      throw new CoreFcaAgentNotFromPublicServiceException();
    }

    // Acr check
    this.coreAcr.checkIfAcrIsValid(idpAcr, spAcr);

    const agentHash = this.getAgentHash(
      idpId,
      idpIdentity as IAgentConnectOidcIdentity,
    );
    await this.coreAccount.checkIfAccountIsBlocked(agentHash);
    const sub = this.cryptographyFca.computeSubV1(spId, agentHash);

    const accountId = await this.saveInteractionToDatabase(
      spId,
      sub,
      agentHash,
    );

    // get sp's sub to avoid double computation
    const spIdentity = this.getSpSub(
      idpIdentity as IAgentConnectOidcIdentity,
      idpId,
      idpAcr,
    );

    await this.storeIdentityWithSessionService(
      sessionOidc,
      sub,
      spIdentity,
      accountId,
    );
  }
}
