import { Injectable } from '@nestjs/common';

import { AccountFcaService } from '@fc/account-fca';
import { CoreAcrService, IVerifyFeatureHandlerHandleArgument } from '@fc/core';
import { CoreFcaAgentNotFromPublicServiceException } from '@fc/core-fca/exceptions';
import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import {
  ServiceProviderAdapterMongoService,
  Types,
} from '@fc/service-provider-adapter-mongo';

import { IAgentIdentity, IAgentIdentityWithPublicness } from '../../interfaces';
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
    protected readonly coreAcr: CoreAcrService,
    protected readonly identityProvider: IdentityProviderAdapterMongoService,
    protected readonly serviceProvider: ServiceProviderAdapterMongoService,
    protected readonly accountService: AccountFcaService,
  ) {
    super(logger, coreAcr, identityProvider, accountService);
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

    const { idpId, idpIdentity, idpAcr, spAcr, spId } = sessionOidc.get();
    // Check if the sp accepts private employees
    const { type } = await this.serviceProvider.getById(spId);

    const isPrivateIdentity =
      (idpIdentity as IAgentIdentityWithPublicness).is_service_public !== true;
    // Types.PUBLIC = sp that accepts public servant only
    // Types.PRIVATE = sp that also accepts private compagnies employes
    const spAcceptsPrivate = type !== Types.PUBLIC;

    if (isPrivateIdentity && !spAcceptsPrivate) {
      throw new CoreFcaAgentNotFromPublicServiceException();
    }

    // Acr check
    const { maxAuthorizedAcr } = await this.identityProvider.getById(idpId);

    this.coreAcr.checkIfAcrIsValid(idpAcr, spAcr, maxAuthorizedAcr);

    // todo: we will need to add a proper way to check and transform sessionOidc into IAgentIdentity
    const agentIdentity = idpIdentity as IAgentIdentity;

    const account = await this.createOrUpdateAccount(agentIdentity, idpId);
    this.checkIfAccountIsBlocked(account);

    const fcaIdentity = this.composeFcaIdentity(agentIdentity, idpId, idpAcr);

    this.storeIdentityWithSessionService(
      sessionOidc,
      account.sub,
      fcaIdentity,
      account.id,
    );
  }
}
