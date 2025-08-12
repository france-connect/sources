import { Module } from '@nestjs/common';

import { I18nModule } from '@fc/i18n';

import {
  Dto2FormI18nService,
  MetadataFormService,
  ValidateIfRulesService,
  ValidatorCustomService,
} from './services';

@Module({
  imports: [I18nModule],
  providers: [
    ValidatorCustomService,
    ValidateIfRulesService,
    MetadataFormService,
    Dto2FormI18nService,
  ],
  /**
   * Pipes seems to behave differently than services and need their dependencies to be exported to be resolved,
   * even if they are not supposed to be injected in any constructor outside of the module.
   */
  exports: [
    ValidatorCustomService,
    ValidateIfRulesService,
    MetadataFormService,
    Dto2FormI18nService,
  ],
})
export class Dto2formModule {}
