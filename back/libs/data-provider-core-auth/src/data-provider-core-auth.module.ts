/* istanbul ignore file */

// declarative file
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { DataProviderCoreAuthService } from './services';

@Module({
  imports: [HttpModule],
  providers: [DataProviderCoreAuthService],
  exports: [DataProviderCoreAuthService],
})
export class DataProviderCoreAuthModule {}
