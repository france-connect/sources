import { Injectable } from '@nestjs/common';

import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { LoggerService } from '@fc/logger';
import { OidcClientSession } from '@fc/oidc-client';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { SessionService } from '@fc/session';

import { CoreFcpAuthorizationParametersInterface } from '../../interfaces';

@Injectable()
@FeatureHandler('core-fcp-aidants-connect-authorization')
export class CoreFcpAidantsConnectAuthorizationHandler
  implements
    IFeatureHandler<
      CoreFcpAuthorizationParametersInterface,
      CoreFcpAuthorizationParametersInterface
    >
{
  constructor(
    private readonly logger: LoggerService,
    private readonly serviceProvider: ServiceProviderAdapterMongoService,
    private readonly session: SessionService,
  ) {}

  async handle(
    oidcParams: CoreFcpAuthorizationParametersInterface,
  ): Promise<CoreFcpAuthorizationParametersInterface> {
    this.logger.debug(
      'getInteraction: ##### core-fcp-aidants-connect-authorization',
    );

    const { spId } = this.session.get<OidcClientSession>('OidcClient');
    const { rep_scope } = await this.serviceProvider.getById(spId);

    const claims = {
      id_token: {
        rep_scope: {
          essential: true,
          values: rep_scope,
        },
      },
    };

    return Object.assign(oidcParams, {
      claims,
    });
  }
}
