/* istanbul ignore file */

// Declarative code
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { OidcClientTokenEvent } from '@fc/oidc-client';
import { TrackingHandler } from '@fc/tracking';

@EventsHandler(OidcClientTokenEvent)
export class OidcClientTokenEventHandler
  extends TrackingHandler
  implements IEventHandler<OidcClientTokenEvent>
{
  async handle(event: OidcClientTokenEvent) {
    this.log(this.EventsMap.FC_REQUESTED_IDP_TOKEN, event);
  }
}
