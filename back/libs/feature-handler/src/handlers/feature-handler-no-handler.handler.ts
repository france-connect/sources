import { Injectable } from '@nestjs/common';

import { IFeatureHandler } from '../interfaces';

/**
 * This Class is used to emulate an empty FeatureHandler for all the cases
 * where no action is specified in the database, Ex: featureHandlers: { ... actionName: null, ... }
 */
@Injectable()
export class FeatureHandlerNoHandler implements IFeatureHandler<null, void> {
  async handle() {
    return null;
  }
}
