/* istanbul ignore file */

// Declarative code
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { OidcClientUserinfoEvent } from '@fc/oidc-client';
import { TrackingHandler } from '@fc/tracking';

@EventsHandler(OidcClientUserinfoEvent)
export class UserinfoEventHandler
  extends TrackingHandler
  implements IEventHandler<OidcClientUserinfoEvent>
{
  async handle(event: OidcClientUserinfoEvent) {
    this.log(this.EventsMap.FC_REQUESTED_IDP_USERINFO, event);
  }
}
