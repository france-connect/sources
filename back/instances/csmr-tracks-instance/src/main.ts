import '@fc/common/overrides/json.parse.override';

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ConfigService } from '@fc/config';
import { CsmrTracksConfig } from '@fc/csmr-tracks';
import { NestLoggerService } from '@fc/logger';
import { RabbitmqConfig } from '@fc/rabbitmq';

import { AppModule } from './app.module';
import configuration from './config';

async function bootstrap() {
  const configOptions = {
    isGlobal: false,
    config: configuration,
    schema: CsmrTracksConfig,
  };
  // First create app context to access configService
  const configService = new ConfigService(configOptions);

  // Fetch broker options from config
  const options = configService.get<RabbitmqConfig>('TracksBroker');

  const appModule = AppModule.forRoot(configService);
  // Create consumer
  const consumer = await NestFactory.createMicroservice<MicroserviceOptions>(
    appModule,
    {
      transport: Transport.RMQ,
      options,
      bufferLogs: true,
    },
  );

  const logger = await consumer.resolve(NestLoggerService);

  consumer.useLogger(logger);

  // Launch consumer
  await consumer.listen();
  console.log(`Consumer is listening on queue "${options.queue}"`);
}

void bootstrap();
