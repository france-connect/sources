/* istanbul ignore file */

// Declarative file
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ForbidRefreshInterceptor, IsStepInterceptor } from './interceptors';
import { FlowStepsService } from './services';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: IsStepInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ForbidRefreshInterceptor,
    },
    FlowStepsService,
  ],
  exports: [FlowStepsService],
})
export class FlowStepsModule {}
