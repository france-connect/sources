/* istanbul ignore file */

// Declarative code
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { OidcProviderAuthorizationEvent } from '@fc/oidc-provider';
import { TrackingHandler } from '@fc/tracking';

@EventsHandler(OidcProviderAuthorizationEvent)
export class OidcProviderAuthorizationEventHandler
  extends TrackingHandler
  implements IEventHandler<OidcProviderAuthorizationEvent>
{
  async handle(event: OidcProviderAuthorizationEvent) {
    this.log(this.EventsMap.FC_AUTHORIZE_INITIATED, event);
  }
}
