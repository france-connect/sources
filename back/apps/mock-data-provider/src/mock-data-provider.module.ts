/* istanbul ignore file */

// Declarative code
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import {
  DataProviderAdapterCoreModule,
  DataProviderAdapterCoreService,
} from '@fc/data-provider-adapter-core';
import { JwtModule } from '@fc/jwt';

import { MockDataProviderController } from './controllers/mock-data-provider.controller';
import { MockDataProviderService } from './services';

@Module({
  imports: [DataProviderAdapterCoreModule, HttpModule, JwtModule],
  controllers: [MockDataProviderController],
  providers: [MockDataProviderService, DataProviderAdapterCoreService],
})
export class MockDataProviderModule {}
