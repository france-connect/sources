/* istanbul ignore file */

// Not to be tested
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ConfigService } from '@fc/config';
import { CsmrHsmConfig } from '@fc/csmr-hsm';
import { HsmService } from '@fc/hsm';
import { RabbitmqConfig } from '@fc/rabbitmq';

import { AppModule } from './app.module';
import configuration from './config';

async function bootstrap() {
  const configOptions = {
    config: configuration,
    schema: CsmrHsmConfig,
  };
  // First create app context to access configService
  const configService = new ConfigService(configOptions);

  // Fetch broker options from config
  const options = configService.get<RabbitmqConfig>('CryptographyBroker');

  const appModule = AppModule.forRoot(configService);

  // Create consumer
  const consumer = await NestFactory.createMicroservice<MicroserviceOptions>(
    appModule,
    {
      transport: Transport.RMQ,
      options,
    },
  );

  /**
   * "Consumer suicide" strategy:
   * The consumer chooses to kill its self in case of something going wrong.
   * We let the process manager (PM2, nodemon, etc.) respawn the consumer
   * until things are back to normal.
   *
   * We use "setTimeout" for two reasons:
   *  - First it allows us to temper the restarts of the consumer
   *  - Second, NestJs `app.close()` does not work until the app is fully started.
   *    This is an issue when the HSM is unavailable at the launch of the consumer (which is most likely to happen after a first "suicide").
   */
  consumer.get(HsmService).shutdownConsumer = () => {
    setTimeout(() => {
      consumer.close();
    }, 1000);
  };

  // Launch consumer
  await consumer.listen();
  console.log(`Consumer is listening on queue "${options.queue}"`);
}
bootstrap();
