/* istanbul ignore file */

// Declarative file
import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { TemplateInterceptor } from './interceptors';
import { ViewTemplateService } from './services';

@Global()
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TemplateInterceptor,
    },
    ViewTemplateService,
  ],
  exports: [ViewTemplateService],
})
export class ViewTemplatesModule {}
