/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { CryptographyModule } from '@fc/cryptography';

import { ServiceProviderAdapterEnvService } from './service-provider-adapter-env.service';

@Module({
  imports: [CryptographyModule],
  providers: [ServiceProviderAdapterEnvService],
  exports: [ServiceProviderAdapterEnvService],
})
export class ServiceProviderAdapterEnvModule {}
