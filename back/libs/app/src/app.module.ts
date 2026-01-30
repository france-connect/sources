import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppInterceptor } from './interceptors';
import { AssetsService } from './services';

@Module({
  exports: [AssetsService],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
    AssetsService,
  ],
})
export class AppModule {}
