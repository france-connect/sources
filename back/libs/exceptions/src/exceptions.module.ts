import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { TrackingModule } from '@fc/tracking';

import {
  FcExceptionFilter,
  HttpExceptionFilter,
  RpcExceptionFilter,
  UnhandledExceptionFilter,
  ValidationExceptionFilter,
} from './exception-filters';
import { ExceptionsService } from './exceptions.service';

@Module({
  imports: [TrackingModule.forLib()],
  providers: [
    ExceptionsService,
    /**
     * Globally load our custom exception filters
     * @see https://docs.nestjs.com/exception-filters
     */
    {
      provide: APP_FILTER,
      useClass: UnhandledExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: RpcExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: FcExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
  ],
})
export class ExceptionsModule {}
