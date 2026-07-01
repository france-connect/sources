import { KoaContextWithOIDC } from 'oidc-provider';

import { Injectable } from '@nestjs/common';

import { AsyncFunctionSafe, nowInSeconds } from '@fc/common';
import { OidcSession } from '@fc/oidc';
import {
  OidcProviderAppConfigLibService,
  OidcProviderRuntimeException,
} from '@fc/oidc-provider';

/**
 * Static test identity returned unconditionally by the wallet-bridge.
 * No user interaction is required: the bridge always authenticates as this account at eidas3.
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2574
 */
const TEST_IDENTITY = {
  sub: '17ea2fcfdffc94b43ae8abdf399a4e1fe05a9869b8b197ce451c9a1ac6210584v1',
  given_name: 'Angela Claire Louise',
  family_name: 'DUBOIS',
  birthdate: '1962-08-24',
  gender: 'female',
  email: 'wossewodda-3728@yopmail.com',
  birthplace: '75107',
  birthcountry: '99100',
};

@Injectable()
export class WalletBridgeIdentityService extends OidcProviderAppConfigLibService {
  /**
   * Returns the static test identity regardless of the provided sessionId.
   * The wallet-bridge does not persist identity in session — no session lookup is needed.
   * @see https://github.com/panva/node-oidc-provider/blob/main/docs/README.md#accounts
   */
  findAccount(
    _ctx: KoaContextWithOIDC,
    _sessionId: string,
  ): Promise<{ accountId: string; claims: AsyncFunctionSafe }> {
    return Promise.resolve({
      accountId: TEST_IDENTITY.sub,
      claims: () => Promise.resolve(TEST_IDENTITY),
    });
  }

  /**
   * Completes the OIDC interaction unconditionally with the static test identity.
   * Session is not read: accountId and acr are always hardcoded to TEST_IDENTITY.sub and eidas3.
   * Called from GET /interaction/:uid — no user input step.
   * @see https://github.com/panva/node-oidc-provider/blob/main/docs/README.md#user-flows
   */
  async finishInteraction(
    req: any,
    res: any,
    _session: OidcSession,
  ): Promise<void> {
    const grant = await this.grantService.generateGrant(
      this.provider,
      req,
      res,
      TEST_IDENTITY.sub,
    );

    const grantId = await this.grantService.saveGrant(grant);

    const result = {
      login: {
        acr: 'eidas3',
        accountId: TEST_IDENTITY.sub,
        ts: nowInSeconds(),
        remember: false,
      },
      consent: {
        grantId,
      },
    };

    try {
      await this.provider.interactionFinished(req, res, result);
    } catch (error) {
      throw new OidcProviderRuntimeException(error);
    }
  }
}
