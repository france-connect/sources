/* istanbul ignore file */

// Declarative code
import { Injectable } from '@nestjs/common';

import { FeatureHandler } from '@fc/feature-handler';

/**
 * @todo #FC-858
 * In order to use IdentityProviderAdapterMongo and get the list
 * of identity providers, we currently need to create an handler,
 * even if we do not use the connection logic because the DTO will fail,
 * In order to use IdentityProviderAdapterMongo and get the list
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/858
 * Author: Annouar LAIFA
 * Date: 10/01/2022
 */
@Injectable()
@FeatureHandler('core-fcp-default-verify')
@FeatureHandler('core-fcp-send-email')
@FeatureHandler('core-fcp-default-identity-check')
export class CsmrUserPreferenceHandler {
  constructor() {}

  // Async needed for the handler signature
  // eslint-disable-next-line require-await
  async handle(): Promise<void> {
    throw new Error();
  }
}
