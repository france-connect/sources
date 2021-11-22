import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { OidcClientConfig } from '../dto';
import { IIdentityProviderAdapter } from '../interfaces';
import { IDENTITY_PROVIDER_SERVICE } from '../tokens';

@Injectable()
export class OidcClientConfigService {
  constructor(
    readonly config: ConfigService,
    private readonly logger: LoggerService,
    @Inject(IDENTITY_PROVIDER_SERVICE)
    private readonly identityProvider: IIdentityProviderAdapter,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Compose full config by merging static parameters from:
   *  - configuration file (some may be coming from environment variables)
   *  - database (IdP configuration)
   */
  public async get(refresh = false): Promise<OidcClientConfig> {
    const providers = await this.identityProvider.getList(refresh);
    const configuration = this.config.get<OidcClientConfig>('OidcClient');

    return {
      ...configuration,
      providers,
    };
  }
}
