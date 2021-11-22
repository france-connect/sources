/* istanbul ignore file */

// Declarative code
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { HttpProxyService } from './http-proxy.service';

@Module({
  imports: [HttpModule],
  providers: [HttpProxyService],
  exports: [HttpProxyService],
})
export class HttpProxyModule {}
