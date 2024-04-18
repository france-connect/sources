/* istanbul ignore file */

// Declarative file
import { Module } from '@nestjs/common';

import { SessionModule } from '@fc/session';

import { I18nService } from './services/i18n.service';

@Module({
  providers: [I18nService, SessionModule],
  exports: [I18nService],
})
export class I18nModule {}
