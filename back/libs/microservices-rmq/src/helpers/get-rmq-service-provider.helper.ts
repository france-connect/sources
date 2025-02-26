import { Class } from 'type-fest';

import { FactoryProvider } from '@nestjs/common';

import { MicroservicesRmqPublisherService } from '../services';
import { getServiceToken } from './get-service-token.helper';

export function getRmqServiceProvider<T>(
  ServiceClass: Class<T>,
  serviceName?: string,
): FactoryProvider {
  let provideToken = serviceName;

  if (!provideToken) {
    provideToken = ServiceClass.name;
  }

  const rmqServiceToken = getServiceToken(provideToken);

  return {
    provide: provideToken,
    useFactory: (rmqService: MicroservicesRmqPublisherService): T => {
      return new ServiceClass(rmqService);
    },
    inject: [rmqServiceToken],
  };
}
