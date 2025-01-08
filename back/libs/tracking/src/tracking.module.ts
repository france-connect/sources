import { DynamicModule, Module, Type } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule, EventBus } from '@nestjs/cqrs';

import { ExceptionCaughtHandler } from './handlers';
import { TrackingInterceptor } from './interceptors';
import { AppTrackingServiceAbstract } from './interfaces';
import { TrackingService } from './services';
import { APP_TRACKING_SERVICE } from './tokens';

@Module({})
export class TrackingModule {
  static forRoot(
    appTrackingServiceClass: Type<AppTrackingServiceAbstract>,
  ): DynamicModule {
    const appTrackingServiceProvider = {
      provide: APP_TRACKING_SERVICE,
      useClass: appTrackingServiceClass,
    };

    return {
      imports: [CqrsModule],
      module: TrackingModule,
      providers: [
        TrackingService,
        appTrackingServiceProvider,
        {
          provide: APP_INTERCEPTOR,
          useClass: TrackingInterceptor,
        },
        ExceptionCaughtHandler,
        EventBus,
      ],
      exports: [appTrackingServiceProvider, TrackingService],
    };
  }
}
