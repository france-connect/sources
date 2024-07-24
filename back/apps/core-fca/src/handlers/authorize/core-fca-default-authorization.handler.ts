import { Injectable } from '@nestjs/common';

import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { LoggerService } from '@fc/logger';

import { CoreFcaAuthorizationParametersInterface } from '../../interfaces';

@Injectable()
@FeatureHandler('core-fca-default-authorization')
export class CoreFcaDefaultAuthorizationHandler
  implements
    IFeatureHandler<
      CoreFcaAuthorizationParametersInterface,
      CoreFcaAuthorizationParametersInterface
    >
{
  constructor(protected readonly logger: LoggerService) {}

  // Need to respect the interface, has no real impact on the code
  // eslint-disable-next-line require-await
  async handle(
    authorizationParameters: CoreFcaAuthorizationParametersInterface,
  ): Promise<CoreFcaAuthorizationParametersInterface> {
    const coreFcaAuthorizationParameters: CoreFcaAuthorizationParametersInterface =
      Object.assign<
        CoreFcaAuthorizationParametersInterface,
        Partial<CoreFcaAuthorizationParametersInterface>
      >(authorizationParameters, {
        claims: { id_token: { amr: { essential: true } } },
      });

    return coreFcaAuthorizationParameters;
  }
}
