import { Module } from '@nestjs/common';

import { I18nModule } from '@fc/i18n';

import {
  MetadataFormService,
  PartnersI18nService,
  ValidateIfRulesService,
  ValidatorCustomService,
} from './services';

@Module({
  imports: [I18nModule],
  providers: [
    ValidatorCustomService,
    ValidateIfRulesService,
    MetadataFormService,
    PartnersI18nService,
  ],
  /**
   * Pipes seems to behave differently than services and need their dependencies to be exported to be resolved,
   * even if they are not supposed to be injected in any constructor outside of the module.
   */
  exports: [
    ValidatorCustomService,
    ValidateIfRulesService,
    MetadataFormService,
    PartnersI18nService,
  ],
})
export class Dto2formModule {}
