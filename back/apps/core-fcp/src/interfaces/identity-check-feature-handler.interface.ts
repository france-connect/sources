/* istanbul ignore file */

// Declarative code
import { ValidationError } from 'class-validator';

import { IFeatureHandler } from '@fc/feature-handler';
import { MinIdentityDto } from '@fc/oidc-client';

export interface IIdentityCheckFeatureHandler
  extends IFeatureHandler<ValidationError[], MinIdentityDto> {
  /**
   * Override default handler.handle argument type
   */
  handle(options: MinIdentityDto): Promise<ValidationError[]>;
}
