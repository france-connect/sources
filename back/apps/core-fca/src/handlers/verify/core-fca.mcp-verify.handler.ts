import { Injectable } from '@nestjs/common';

import {
  CoreAccountService,
  CoreAcrService,
  IVerifyFeatureHandlerHandleArgument,
} from '@fc/core';
import { CoreFcaAgentNotFromPublicServiceException } from '@fc/core-fca/exceptions';
import { CryptographyFcaService } from '@fc/cryptography-fca';
import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import {
  ServiceProviderAdapterMongoService,
  Types,
} from '@fc/service-provider-adapter-mongo';

import { IAgentConnectOidcIdentity } from '../../interfaces';
import { CoreFcaDefaultVerifyHandler } from './core-fca.default-verify.handler';

@Injectable()
@FeatureHandler('core-fca-mcp-verify')
export class CoreFcaMcpVerifyHandler
  extends CoreFcaDefaultVerifyHandler
  implements IFeatureHandler
{
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    protected readonly logger: LoggerService,
    protected readonly coreAccount: CoreAccountService,
    protected readonly coreAcr: CoreAcrService,
    protected readonly cryptographyFca: CryptographyFcaService,
    protected readonly identityProvider: IdentityProviderAdapterMongoService,
    protected readonly serviceProvider: ServiceProviderAdapterMongoService,
  ) {
    super(logger, coreAccount, coreAcr, cryptographyFca, identityProvider);
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
    this.logger.debug('verifyIdentity service: ##### core-fca-mcp-verify');

    const { idpId, idpIdentity, idpAcr, spId, spAcr } = sessionOidc.get();
    const { type } = await this.serviceProvider.getById(spId);

    const isIdentityPrivate =
      (idpIdentity as IAgentConnectOidcIdentity).is_service_public !== true;
    // Types.PUBLIC = sp that accepts public servant only
    // Types.PRIVATE = sp that also accepts private compagnies employes
    const doesSpAcceptPrivate = type !== Types.PUBLIC;

    if (isIdentityPrivate && !doesSpAcceptPrivate) {
      throw new CoreFcaAgentNotFromPublicServiceException();
    }

    // Acr check
    const { maxAuthorizedAcr } = await this.identityProvider.getById(idpId);

    this.coreAcr.checkIfAcrIsValid(idpAcr, spAcr, maxAuthorizedAcr);

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

    this.storeIdentityWithSessionService(
      sessionOidc,
      sub,
      spIdentity,
      accountId,
    );
  }
}
