/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { CsmrTracksConfig } from '@fc/csmr-tracks';

import { IdpMappings } from './idp-mappings.config';

export class CsmrTracksHighConfig extends CsmrTracksConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => IdpMappings)
  readonly IdpMappings: IdpMappings;
}
