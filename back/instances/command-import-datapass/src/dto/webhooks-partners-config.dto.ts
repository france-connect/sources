import { IsNotEmpty, IsUrl } from 'class-validator';

import { WebhooksConfig } from '@fc/webhooks';

export class WebhooksPartnersConfig extends WebhooksConfig {
  // Validator.js defined property
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  readonly url: string;
}
