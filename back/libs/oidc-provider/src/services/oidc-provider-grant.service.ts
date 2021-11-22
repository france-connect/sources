import { Provider } from 'oidc-provider';

import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger';

import { OidcProviderGrantSaveException } from '../exceptions/oidc-provider-grant-save.exception';
import { InteractionParams } from '../interfaces';

@Injectable()
export class OidcProviderGrantService {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }
  /*
   * oidc-provider do not export the Grant type so we need
   * to use Promise<any> for the return type
   */
  async generateGrant(
    provider: Provider,
    req: any,
    res: any,
    accountId: string,
  ): Promise<any> {
    const details = await provider.interactionDetails(req, res);
    const params = details.params as InteractionParams;

    const grant = new provider.Grant();

    grant.accountId = accountId;
    grant.clientId = params.client_id as string;

    /*
     * FC does not support yet selective scope connection
     * that's why we get them directly from authorization
     * params from the ServiceProvider
     */
    params.scope.split(' ').forEach((scope) => {
      grant.addOIDCScope(scope);
    });

    return grant;
  }

  async saveGrant(grant: { save: Function }): Promise<string> {
    try {
      const result = await grant.save();
      return result;
    } catch (error) {
      throw new OidcProviderGrantSaveException(error);
    }
  }
}
