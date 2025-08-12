import { Module } from '@nestjs/common';

import { CryptographyModule } from '@fc/cryptography';

import { WebhooksService } from './services';

@Module({
  imports: [CryptographyModule],
  providers: [WebhooksService],
  exports: [WebhooksService],
})
export class WebhooksModule {}
