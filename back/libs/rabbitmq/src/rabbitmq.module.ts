import { DynamicModule, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { ConfigService } from '@fc/config';

import { RabbitmqConfig } from './dto';

@Module({})
export class RabbitmqModule {
  /**
   * Create a rabbitmq module for a specific module
   *
   * @param moduleName Your module name
   * @returns You will get an Injectable service with the token
   * "<moduleName>Broker".
   *
   * example, if you want a broker for FoobarModule, in your module
   *
   * ```typescript
   * // foobar.module.ts
   * @module({
   *   imports: [RabbitmqModule.registerFor('Foobar')]
   * })
   * ```
   *
   * ...and in your service:
   *
   * ```typescript
   * // foobar.service.ts
   *
   * export class FoobarService {
   *   constructor(@Inject('FoobarBroker') private broker) {}
   * }
   * ```
   *
   * You should create a configuration section matching the same name:
   *
   * ```typescript
   *  // apps/my-app/src/config/foobar-broker.ts
   *
   * import { RabbitmqConfig } from '@fc/rabbitmq';
   *
   * export default {
   *   urls: <your urls array>,
   *   queue: <your queue name>,
   *   queueOptions: {
   *     durable: false,
   *   },
   * } as RabbitmqConfig;
   * ```
   * ```typescript
   *  // apps/my-app/src/config/index.ts
   *
   * import FoobarBroker from './foobar-broker.ts';
   *
   * export default {
   *   FoobarBroker,
   * } as MyAppConfig;
   * ```
   *
   *
   */
  static RABBIT_CLASS_SUFFIX = 'Broker';

  static registerFor(moduleName: string): DynamicModule {
    const clientName = `${moduleName}${RabbitmqModule.RABBIT_CLASS_SUFFIX}`;
    const BrokerProvider = {
      provide: clientName,
      useFactory: (config: ConfigService) => {
        const options = config.get<RabbitmqConfig>(clientName);
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options,
        });
      },
      inject: [ConfigService],
    };

    return {
      module: RabbitmqModule,
      providers: [BrokerProvider],
      exports: [BrokerProvider],
    };
  }
}
