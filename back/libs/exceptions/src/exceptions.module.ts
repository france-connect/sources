/* istanbul ignore file */

// Declarative code
import { DynamicModule, Module } from '@nestjs/common';

import { TrackingService } from '@fc/tracking';
import { ViewTemplatesModule } from '@fc/view-templates';

import { ExceptionsService } from './exceptions.service';

@Module({})
export class ExceptionsModule {
  static withTracking(trackingModule: DynamicModule) {
    return {
      module: ExceptionsModule,
      imports: [trackingModule, ViewTemplatesModule],
      providers: [ExceptionsService, TrackingService],
      exports: [TrackingService],
    };
  }
  static withoutTracking() {
    const provider = {
      provide: TrackingService,
      useValue: null,
    };
    return {
      module: ExceptionsModule,
      imports: [ViewTemplatesModule],
      providers: [ExceptionsService, provider],
      exports: [provider],
    };
  }
}
