/* istanbul ignore file */

// Declarative code
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { JwtModule } from '@fc/jwt';

import { DataProviderAdapterCoreService } from './data-provider-adapter-core.service';

@Module({
  imports: [HttpModule, JwtModule],
  providers: [DataProviderAdapterCoreService],
  exports: [DataProviderAdapterCoreService],
})
export class DataProviderAdapterCoreModule {}
