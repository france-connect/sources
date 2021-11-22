/* istanbul ignore file */

// Declarative code
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { TrackingHandler } from '@fc/tracking';

import { CoreFcpDatatransferInformationAnonymousEvent } from '../events';

@EventsHandler(CoreFcpDatatransferInformationAnonymousEvent)
export class CoreFcpDatatransferInformationAnonymousEventHAndler
  extends TrackingHandler
  implements IEventHandler<CoreFcpDatatransferInformationAnonymousEvent>
{
  async handle(event: CoreFcpDatatransferInformationAnonymousEvent) {
    this.log(this.EventsMap['FC_DATATRANSFER:INFORMATION:ANONYMOUS'], event);
  }
}
