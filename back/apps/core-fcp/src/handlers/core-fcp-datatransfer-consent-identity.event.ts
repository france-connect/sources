/* istanbul ignore file */

// Declarative code
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { TrackingHandler } from '@fc/tracking';

import { CoreFcpDatatransferConsentIdentityEvent } from '../events';

@EventsHandler(CoreFcpDatatransferConsentIdentityEvent)
export class CoreFcpDatatransferConsentIdentityEventHandler
  extends TrackingHandler
  implements IEventHandler<CoreFcpDatatransferConsentIdentityEvent>
{
  async handle(event: CoreFcpDatatransferConsentIdentityEvent) {
    this.log(this.EventsMap['FC_DATATRANSFER:CONSENT:IDENTITY'], event);
  }
}
