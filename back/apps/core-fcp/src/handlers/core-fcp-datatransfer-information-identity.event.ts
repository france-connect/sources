/* istanbul ignore file */

// Declarative code
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { TrackingHandler } from '@fc/tracking';

import { CoreFcpDatatransferInformationIdentityEvent } from '../events';

@EventsHandler(CoreFcpDatatransferInformationIdentityEvent)
export class CoreFcpDatatransferInformationIdentityEventHandler
  extends TrackingHandler
  implements IEventHandler<CoreFcpDatatransferInformationIdentityEvent>
{
  async handle(event: CoreFcpDatatransferInformationIdentityEvent) {
    this.log(this.EventsMap['FC_DATATRANSFER:INFORMATION:IDENTITY'], event);
  }
}
