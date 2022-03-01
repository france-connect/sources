/* istanbul ignore file */

// Not to be tested
import { CsmrUserPreferencesConfig } from 'apps/csmr-user-preferences/src';

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ConfigService } from '@fc/config';
import { RabbitmqConfig } from '@fc/rabbitmq';

import { AppModule } from './app.module';
import configuration from './config';

async function bootstrap() {
  const configOptions = {
    config: configuration,
    schema: CsmrUserPreferencesConfig,
  };

  const configService = new ConfigService(configOptions);
  const options = configService.get<RabbitmqConfig>('Broker');

  const appModule = AppModule.forRoot(configService);

  const consumer = await NestFactory.createMicroservice<MicroserviceOptions>(
    appModule,
    {
      transport: Transport.RMQ,
      options,
    },
  );

  await consumer.listen();
  console.log(`Consumer is listening "${options.queue}" queue`);
}

bootstrap();
