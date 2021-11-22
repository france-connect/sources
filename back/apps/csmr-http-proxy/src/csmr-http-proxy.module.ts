/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { ExceptionsModule } from '@fc/exceptions';

import { CsmrHttpProxyController } from './controllers';
import { CsmrHttpProxyService } from './services';

@Module({
  imports: [ExceptionsModule],
  controllers: [CsmrHttpProxyController],
  providers: [CsmrHttpProxyService],
})
export class CsmrHttpProxyModule {}
