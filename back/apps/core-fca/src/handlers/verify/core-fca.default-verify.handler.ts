import { flatMap, uniq } from 'lodash';

import { Injectable } from '@nestjs/common';

import { AccountFca, AccountFcaService, IIdpAgentKeys } from '@fc/account-fca';
import { ConfigService } from '@fc/config';
import { CoreAcrService, IVerifyFeatureHandlerHandleArgument } from '@fc/core';
import { CoreFcaAgentAccountBlockedException } from '@fc/core-fca/exceptions/core-fca-account-blocked.exception';
import { IAgentIdentity } from '@fc/core-fca/interfaces';
import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { standardJwtClaims } from '@fc/jwt';
import { LoggerService } from '@fc/logger';
import { IOidcIdentity } from '@fc/oidc';
import { OidcAcrService } from '@fc/oidc-acr';
import { OidcClientSession } from '@fc/oidc-client';
import { OidcProviderConfig } from '@fc/oidc-provider';
import { ISessionService } from '@fc/session';

@Injectable()
@FeatureHandler('core-fca-default-verify')
export class CoreFcaDefaultVerifyHandler implements IFeatureHandler {
  private expectedClaims: string[] = [];

  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    protected readonly logger: LoggerService,
    protected readonly coreAcr: CoreAcrService,
    protected readonly identityProvider: IdentityProviderAdapterMongoService,
    protected readonly accountService: AccountFcaService,
    protected readonly oidcAcr: OidcAcrService,
    protected readonly config: ConfigService,
  ) {}

  onModuleInit(): void {
    this.expectedClaims = this.getExpectedClaims();
  }

  /**
   * Main business manipulations occurs in this method
   *
   * 1. Get infos on current interaction and identity fetched from IdP
   * 2. Create or update account with interaction (long term storage)
   * 3. Store identity with session service (short term storage)
   *
   * @param req
   */
  async handle({
    sessionOidc,
  }: IVerifyFeatureHandlerHandleArgument): Promise<void> {
    this.logger.debug('verifyIdentity service: ##### core-fca-default-verify');

    const { idpId, idpIdentity, idpAcr, spAcr, isSso } = sessionOidc.get();

    // Acr check
    const { allowedAcr } = await this.identityProvider.getById(idpId);

    this.coreAcr.checkIfAcrIsValid(idpAcr, spAcr, allowedAcr);
    const interactionAcr = this.oidcAcr.getInteractionAcr({
      idpAcr,
      spAcr,
      isSso,
    });

    // we need to create a deep copy of idpIdentity to avoid to customize the original object
    const agentIdentity = { ...idpIdentity } as IAgentIdentity;

    const account = await this.createOrUpdateAccount(agentIdentity, idpId);

    this.checkIfAccountIsBlocked(account);

    const fcaIdentity = this.composeFcaIdentity(agentIdentity, idpId, idpAcr);

    this.storeIdentityWithSessionService(
      sessionOidc,
      account.sub,
      fcaIdentity,
      account.id,
      interactionAcr,
    );
  }

  protected async createOrUpdateAccount(
    agentIdentity: IAgentIdentity,
    idpUid: string,
  ): Promise<AccountFca> {
    const account = await this.getAccountForInteraction(agentIdentity, idpUid);

    this.updateAccountWithInteraction(account, agentIdentity, idpUid);

    await this.accountService.upsertWithSub(account);

    return account;
  }

  private async getAccountForInteraction(
    agentIdentity: IAgentIdentity,
    idpUid: string,
  ): Promise<AccountFca> {
    const idpAgentKeys = this.getIdpAgentKeys(idpUid, agentIdentity.sub);
    const existingAccount =
      await this.accountService.getAccountByIdpAgentKeys(idpAgentKeys);

    if (existingAccount) {
      return existingAccount;
    }

    return this.accountService.createAccount();
  }

  private updateAccountWithInteraction(
    account: AccountFca,
    agentIdentity: IAgentIdentity,
    idpUid: string,
  ): void {
    const { sub } = agentIdentity;
    const hasInteraction = this.hasInteraction(account, sub);

    if (!hasInteraction) {
      account.idpIdentityKeys.push({ idpSub: sub, idpUid });
    }

    account.lastConnection = new Date();
  }

  private hasInteraction(account: AccountFca, sub: string): boolean {
    return !!account.idpIdentityKeys.find(
      ({ idpSub, idpUid }) => idpSub === sub && idpUid === idpUid,
    );
  }

  // IdpAgentKeys is a combination of idpId and idpSub
  protected getIdpAgentKeys(idpUid: string, idpSub: string): IIdpAgentKeys {
    return {
      idpUid,
      idpSub,
    };
  }

  protected composeFcaIdentity(
    idpIdentity: IAgentIdentity,
    idpId: string,
    idpAcr: string,
  ): {
    idp_id: string;
    idp_acr: string;
  } & Omit<IAgentIdentity, 'sub'> {
    const customizedIdentity = this.customizeIdentity(idpIdentity);
    const { sub: _sub, ...spIdentityCleaned } = customizedIdentity;

    return {
      ...spIdentityCleaned,
      idp_id: idpId,
      idp_acr: idpAcr,
    };
  }

  // New parameter needed
  // @fixme Check with AC team what to do about that
  // eslint-disable-next-line max-params
  protected storeIdentityWithSessionService(
    sessionOidc: ISessionService<OidcClientSession>,
    sub: string,
    spIdentity: Partial<Omit<IOidcIdentity, 'sub'>>,
    accountId: string,
    interactionAcr: string,
  ): void {
    const { idpIdentity, spId, amr, subs } = sessionOidc.get();

    const session: OidcClientSession = {
      amr,
      idpIdentity,
      spIdentity,
      accountId,
      interactionAcr,
      subs: { ...subs, [spId]: sub },
    };

    sessionOidc.set(session);
  }

  protected checkIfAccountIsBlocked(account: AccountFca): void {
    if (!account.active) {
      throw new CoreFcaAgentAccountBlockedException();
    }
  }

  // All unknown properties from idp identity are moved to "custom" property
  private customizeIdentity(identity: IAgentIdentity): IAgentIdentity {
    /*
     * Some IdPs may return a "custom" field in the userinfo response.
     *
     * In FCA, we use the "custom" field as a catch-all to store any unexpected values,
     * which leads FCA to assume that the "custom" property is part of the FCA identity by default.
     *
     * However, this is not the case, and we need to include the IdP's "custom" content
     * within the FCA's "custom" field for user info.
     *
     * Therefore, when an IdP provides a "custom" property, we will store its content
     * within a sub-property under FCA's "custom" field.
     * Example: { custom: { custom: "some content" } }
     */
    const knownClaims = this.expectedClaims
      .concat(standardJwtClaims)
      .filter((claim) => {
        return claim !== 'custom';
      });

    const [customizedIdentity, custom] = Object.entries(identity).reduce<
      [IAgentIdentity, Record<string, unknown>]
    >(
      ([accCustomized, accCustom], [key, value]) => {
        return knownClaims.includes(key)
          ? [{ ...accCustomized, [key]: value }, accCustom] // Add to customizedIdentity
          : [accCustomized, { ...accCustom, [key]: value }]; // Add to custom
      },
      [{} as IAgentIdentity, {}],
    );

    return {
      ...customizedIdentity,
      custom,
    };
  }

  private getExpectedClaims(): string[] {
    const { configuration } =
      this.config.get<OidcProviderConfig>('OidcProvider');
    return uniq(flatMap(configuration.claims, (claims) => claims));
  }
}
