/* istanbul ignore file */

// Declarative code
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { LoggerService } from '@fc/logger';

import { ServiceProviderUpdateEvent } from '../events/service-provider-update.event';
import { ServiceProviderAdapterMongoService } from '../service-provider-adapter-mongo.service';

@EventsHandler(ServiceProviderUpdateEvent)
export class ServiceProviderUpdateHandler
  implements IEventHandler<ServiceProviderUpdateEvent>
{
  constructor(
    private readonly logger: LoggerService,
    private readonly providerService: ServiceProviderAdapterMongoService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async handle(): Promise<void> {
    this.logger.trace({ action: 'handled' });
    this.providerService.getList(true);
  }
}
