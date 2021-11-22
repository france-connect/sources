/* istanbul ignore file */

// Not to be tested
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

import { ConfigService } from '@fc/config';
import { UserPreferencesFcpConfig } from '@fc/user-preferences-fcp';

import { AppModule } from './app.module';
import configuration from './config';

async function bootstrap() {
  const configOptions = {
    config: configuration,
    schema: UserPreferencesFcpConfig,
  };

  const configService = new ConfigService(configOptions);

  const appModule = AppModule.forRoot(configService);

  const consumer = await NestFactory.createMicroservice<MicroserviceOptions>(
    appModule,
  );

  await consumer.listen();
}

bootstrap();
