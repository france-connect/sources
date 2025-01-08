import { Module } from '@nestjs/common';

import {
  MetadataFormService,
  ValidateIfRulesService,
  ValidatorCustomService,
} from './services';

@Module({
  providers: [
    ValidatorCustomService,
    ValidateIfRulesService,
    MetadataFormService,
  ],
  /**
   * Pipes seems to behave differently than services and need their dependencies to be exported to be resolved,
   * even if they are not supposed to be injected in any constructor outside of the module.
   */
  exports: [
    ValidatorCustomService,
    ValidateIfRulesService,
    MetadataFormService,
  ],
})
export class Dto2formModule {}
