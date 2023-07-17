/* istanbul ignore file */

// Declarative code
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { DataProviderAdapterCoreService } from '@fc/data-provider-adapter-core';

import { MockDataProviderController } from './controllers/mock-data-provider.controller';

@Module({
  imports: [HttpModule],
  controllers: [MockDataProviderController],
  providers: [DataProviderAdapterCoreService],
})
export class MockDataProviderModule {}
