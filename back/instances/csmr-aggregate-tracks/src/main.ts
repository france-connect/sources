/* istanbul ignore file */

// Not to be tested
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ConfigService } from '@fc/config';
import { CsmrAggregateTracksConfig } from '@fc/csmr-aggregate-tracks';
import { RabbitmqConfig } from '@fc/rabbitmq';

import { AppModule } from './app.module';
import configuration from './config';

async function bootstrap() {
  const configOptions = {
    isGlobal: false,
    config: configuration,
    schema: CsmrAggregateTracksConfig,
  };
  // First create app context to access configService
  const configService = new ConfigService(configOptions);

  // Fetch broker options from config
  const options = configService.get<RabbitmqConfig>('AggregateTracksBroker');

  const appModule = AppModule.forRoot(configService);
  // Create consumer
  const consumer = await NestFactory.createMicroservice<MicroserviceOptions>(
    appModule,
    {
      transport: Transport.RMQ,
      options,
    },
  );

  // Launch consumer
  await consumer.listen();
  console.log(`Consumer is listening on queue "${options.queue}"`);
}
bootstrap();
