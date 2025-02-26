import { DynamicModule, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { MicroservicesRmqConfig } from './dto';
import { MicroservicesRmqExceptionFilter } from './filters';
import { getServiceToken } from './helpers';
import { MicroservicesRmqInterceptor } from './interceptors';
import {
  MicroservicesRmqPublisherService,
  MicroservicesRmqSubscriberService,
} from './services';

@Module({})
export class MicroservicesRmqModule {
  static forPublisher(moduleName: string): DynamicModule {
    const serviceName = getServiceToken(moduleName);

    const rmqServiceProvider = {
      provide: serviceName,
      useFactory: (config: ConfigService, logger: LoggerService) => {
        const options = config.get<MicroservicesRmqConfig>(serviceName);

        const broker = ClientProxyFactory.create({
          transport: Transport.RMQ,
          options,
        });

        return new MicroservicesRmqPublisherService(
          config,
          logger,
          broker,
          moduleName,
        );
      },
      inject: [ConfigService, LoggerService],
    };

    return {
      module: MicroservicesRmqModule,
      providers: [rmqServiceProvider],
      exports: [rmqServiceProvider],
    };
  }

  static forSubscriber(): DynamicModule {
    return {
      module: MicroservicesRmqModule,
      imports: [AsyncLocalStorageModule, CqrsModule],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: MicroservicesRmqInterceptor,
        },
        {
          provide: APP_FILTER,
          useClass: MicroservicesRmqExceptionFilter,
        },
        MicroservicesRmqSubscriberService,
      ],
      exports: [AsyncLocalStorageModule, MicroservicesRmqSubscriberService],
    };
  }
}
