/* istanbul ignore file */

// Declarative file
import { Module } from '@nestjs/common';

import { I18nService } from '@fc/i18n';

import { ExceptionsFcpService } from './services/exceptions-fcp.service';

@Module({
  providers: [ExceptionsFcpService, I18nService],
  exports: [ExceptionsFcpService],
})
export class ExceptionsFcpModule {}
