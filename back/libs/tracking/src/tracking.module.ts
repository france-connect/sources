/* istanbul ignore file */

// Declarative code
import { DynamicModule, Module, Type } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { APP_TRACKING_SERVICE } from './app-tracking-service.token';
import { TrackingInterceptor } from './interceptors';
import { IAppTrackingService } from './interfaces';
import { TrackingService } from './tracking.service';

@Module({})
export class TrackingModule {
  static forRoot(
    appTrackingServiceClass: Type<IAppTrackingService>,
  ): DynamicModule {
    return {
      module: TrackingModule,
      imports: [CqrsModule],
      providers: [
        TrackingService,
        {
          provide: APP_TRACKING_SERVICE,
          useClass: appTrackingServiceClass,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: TrackingInterceptor,
        },
      ],
      exports: [TrackingService],
    };
  }
  static forLib() {
    return {
      module: TrackingModule,
      imports: [CqrsModule],
      providers: [
        TrackingService,
        {
          provide: APP_TRACKING_SERVICE,
          // We do not need APP_TRACKING_SERVICE for libs.
          useValue: {},
        },
      ],
      exports: [TrackingService],
    };
  }
}
