import { DynamicModule, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { CsmrFraudClientModule } from '@fc/csmr-fraud-client';
import { CsrfModule } from '@fc/csrf';
import { Dto2formModule, FormValidationExceptionFilter } from '@fc/dto2form';

import { FraudController } from './controllers';
import { FraudIdentityTheftService } from './services';

@Module({})
export class FraudIdentityTheftModule {
  static register(trackingModule: DynamicModule): DynamicModule {
    return {
      module: FraudIdentityTheftModule,
      imports: [
        CsmrFraudClientModule,
        CsrfModule,
        Dto2formModule,
        CqrsModule,
        trackingModule,
      ],
      controllers: [FraudController],
      providers: [
        FormValidationExceptionFilter,
        {
          provide: APP_FILTER,
          useClass: FormValidationExceptionFilter,
        },
        FraudIdentityTheftService,
      ],
    };
  }
}
