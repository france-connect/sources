import { Injectable } from '@nestjs/common';

import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { LoggerService } from '@fc/logger';
import { AuthorizationParameters } from '@fc/oidc-client';

@Injectable()
@FeatureHandler('core-fcp-default-authorization')
export class CoreFcpDefaultAuthorizationHandler
  implements IFeatureHandler<AuthorizationParameters, AuthorizationParameters>
{
  constructor(protected readonly logger: LoggerService) {}

  // Need to respect the interface, has no real impact on the code
  // eslint-disable-next-line require-await
  async handle(
    authorizationParameters: AuthorizationParameters,
  ): Promise<AuthorizationParameters> {
    return authorizationParameters;
  }
}
