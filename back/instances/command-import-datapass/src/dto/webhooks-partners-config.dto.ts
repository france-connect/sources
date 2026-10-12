import { IsNotEmpty, IsUrl } from 'class-validator';

import { WebhooksConfig } from '@fc/webhooks';

export class WebhooksPartnersConfig extends WebhooksConfig {
  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  readonly url: string;
}
