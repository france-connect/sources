/* istanbul ignore file */

// Declarative code
import { DynamicModule, Module, Type } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

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
      module: TrackingModule,
      providers: [
        TrackingService,
        appTrackingServiceProvider,
        {
          provide: APP_INTERCEPTOR,
          useClass: TrackingInterceptor,
        },
      ],
      exports: [appTrackingServiceProvider, TrackingService],
    };
  }
}
