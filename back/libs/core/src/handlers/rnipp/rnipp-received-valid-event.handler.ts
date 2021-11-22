/* istanbul ignore file */

// Declarative code
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { RnippReceivedValidEvent } from '@fc/rnipp';
import { TrackingHandler } from '@fc/tracking';

@EventsHandler(RnippReceivedValidEvent)
export class RnippReceivedValidEventHandler
  extends TrackingHandler
  implements IEventHandler<RnippReceivedValidEvent>
{
  async handle(event: RnippReceivedValidEvent) {
    this.log(this.EventsMap.FC_RECEIVED_VALID_RNIPP, event);
  }
}
