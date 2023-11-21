import { Injectable } from '@nestjs/common';

import {
  CoreAccountService,
  CoreAcrService,
  IVerifyFeatureHandlerHandleArgument,
} from '@fc/core';
import { CryptographyFcaService, IAgentIdentity } from '@fc/cryptography-fca';
import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { LoggerService } from '@fc/logger-legacy';
import { IOidcIdentity } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionService } from '@fc/session';

@Injectable()
@FeatureHandler('core-fca-default-verify')
export class CoreFcaDefaultVerifyHandler implements IFeatureHandler {
  constructor(
    protected readonly logger: LoggerService,
    protected readonly coreAccount: CoreAccountService,
    protected readonly coreAcr: CoreAcrService,
    protected readonly cryptographyFca: CryptographyFcaService,
  ) {
    this.logger.setContext(this.constructor.name);
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

    // Acr check
    this.coreAcr.checkIfAcrIsValid(idpAcr, spAcr);

    // todo: we will need to add a proper way to check and transform sessionOidc into IAgentIdentity
    const agentIdentity = idpIdentity as IAgentIdentity;

    const agentHash = this.getAgentHash(idpId, agentIdentity);
    await this.coreAccount.checkIfAccountIsBlocked(agentHash);
    const sub = this.cryptographyFca.computeSubV1(spId, agentHash);

    const accountId = await this.saveInteractionToDatabase(
      spId,
      sub,
      agentHash,
    );

    // get sp's sub to avoid double computation
    const spIdentity = this.getSpSub(agentIdentity, idpId, idpAcr);

    await this.storeIdentityWithSessionService(
      sessionOidc,
      sub,
      spIdentity,
      accountId,
    );
  }

  protected getAgentHash(idpId: string, idpIdentity: IAgentIdentity): string {
    const agentIdentity = idpIdentity;

    return this.cryptographyFca.computeIdentityHash(idpId, agentIdentity);
  }

  protected async saveInteractionToDatabase(
    spId: string,
    sub: string,
    agentHash: string,
  ): Promise<string> {
    return await this.coreAccount.computeFederation({
      key: spId,
      sub,
      identityHash: agentHash,
    });
  }

  protected getSpSub(
    idpIdentity: IAgentIdentity,
    idpId: string,
    idpAcr: string,
  ): {
    // AgentConnect claims naming convention
    // eslint-disable-next-line @typescript-eslint/naming-convention
    idp_id: string;
    // AgentConnect claims naming convention
    // eslint-disable-next-line @typescript-eslint/naming-convention
    idp_acr: string;
  } & Omit<IAgentIdentity, 'sub'> {
    const { sub: _sub, ...spIdentityCleaned } = idpIdentity;

    return {
      ...spIdentityCleaned,
      // AgentConnect claims naming convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      idp_id: idpId,
      // AgentConnect claims naming convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      idp_acr: idpAcr,
    };
  }

  protected async storeIdentityWithSessionService(
    sessionOidc: ISessionService<OidcClientSession>,
    sub: string,
    // AgentConnect claims naming convention
    // eslint-disable-next-line @typescript-eslint/naming-convention
    spIdentity: Partial<Omit<IOidcIdentity, 'sub'>>,
    accountId: string,
  ): Promise<void> {
    const { idpIdentity, spId, amr, subs } = await sessionOidc.get();

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
