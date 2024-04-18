import { Injectable } from '@nestjs/common';

import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { LoggerService } from '@fc/logger';

import { CoreFcaAuthorizationParametersInterface } from '../../interfaces';
import { CoreFcaDefaultAuthorizationHandler } from './core-fca-default-authorization.handler';

export const PUBLICNESS_SCOPE_NAME = 'is_service_public';

@Injectable()
@FeatureHandler('core-fca-mcp-authorization')
export class CoreFcaMcpAuthorizationHandler
  extends CoreFcaDefaultAuthorizationHandler
  implements IFeatureHandler
{
  constructor(protected readonly logger: LoggerService) {
    super(logger);
  }

  async handle(
    authorizationParameters: CoreFcaAuthorizationParametersInterface,
  ): Promise<CoreFcaAuthorizationParametersInterface> {
    const coreFcaAuthorizationParameters = await super.handle(
      authorizationParameters,
    );

    return Object.assign<
      CoreFcaAuthorizationParametersInterface,
      Partial<CoreFcaAuthorizationParametersInterface>
    >(coreFcaAuthorizationParameters, {
      scope: `${coreFcaAuthorizationParameters.scope} ${PUBLICNESS_SCOPE_NAME}`,
    });
  }
}
