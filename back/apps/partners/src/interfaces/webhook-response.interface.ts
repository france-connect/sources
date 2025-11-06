import { HttpStatus } from '@nestjs/common';

import { uuid } from '@fc/common';

export interface WebhookResponseInterface {
  statusCode: HttpStatus;
  serviceProviderId?: uuid;
}
