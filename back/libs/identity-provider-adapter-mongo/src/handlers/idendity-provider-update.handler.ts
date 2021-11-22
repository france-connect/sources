/* istanbul ignore file */

// Declarative code
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { IdentityProviderUpdateEvent } from '../events';
import { IdentityProviderAdapterMongoService } from '../identity-provider-adapter-mongo.service';

@EventsHandler(IdentityProviderUpdateEvent)
export class IdentityProviderUpdateHandler
  implements IEventHandler<IdentityProviderUpdateEvent>
{
  constructor(
    private readonly identityProvider: IdentityProviderAdapterMongoService,
  ) {}

  public async handle(): Promise<void> {
    this.identityProvider.getList(true);
  }
}
