/* istanbul ignore file */

// Declarative code
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { OidcProviderUserinfoEvent } from '@fc/oidc-provider';
import { TrackingHandler } from '@fc/tracking';

@EventsHandler(OidcProviderUserinfoEvent)
export class OidcProviderUserinfoEventHandler
  extends TrackingHandler
  implements IEventHandler<OidcProviderUserinfoEvent>
{
  async handle(event: OidcProviderUserinfoEvent) {
    this.log(this.EventsMap.SP_REQUESTED_FC_USERINFO, event);
  }
}
