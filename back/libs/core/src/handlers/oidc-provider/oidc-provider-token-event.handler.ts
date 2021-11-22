/* istanbul ignore file */

// Declarative code
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { OidcProviderTokenEvent } from '@fc/oidc-provider';
import { TrackingHandler } from '@fc/tracking';

@EventsHandler(OidcProviderTokenEvent)
export class OidcProviderTokenEventHandler
  extends TrackingHandler
  implements IEventHandler<OidcProviderTokenEvent>
{
  async handle(event: OidcProviderTokenEvent) {
    this.log(this.EventsMap.SP_REQUESTED_FC_TOKEN, event);
  }
}
