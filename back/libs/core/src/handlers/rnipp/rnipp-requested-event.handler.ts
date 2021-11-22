/* istanbul ignore file */

// Declarative code
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { RnippRequestedEvent } from '@fc/rnipp';
import { TrackingHandler } from '@fc/tracking';

@EventsHandler(RnippRequestedEvent)
export class RnippRequestedEventHandler
  extends TrackingHandler
  implements IEventHandler<RnippRequestedEvent>
{
  async handle(event: RnippRequestedEvent) {
    this.log(this.EventsMap.FC_REQUESTED_RNIPP, event);
  }
}
