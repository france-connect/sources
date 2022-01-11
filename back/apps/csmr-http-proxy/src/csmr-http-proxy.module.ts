/* istanbul ignore file */

// Declarative code
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@fc/config';

import { rawTransform, validateStatus } from './config';
import { CsmrHttpProxyController } from './controllers';
import { CsmrHttpProxyService } from './services';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const { requestTimeout: timeout } =
          configService.get('HttpProxyBroker');
        return {
          timeout,
          validateStatus,
          transformResponse: rawTransform,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [CsmrHttpProxyController],
  providers: [CsmrHttpProxyService],
})
export class CsmrHttpProxyModule {}
