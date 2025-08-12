import { CommandFactory } from 'nest-commander';

import { CommandRunnerConfig } from '@fc/command-runner';
import { ConfigService } from '@fc/config';
import { NestLoggerService } from '@fc/logger';

import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  const configService = new ConfigService({
    config,
    schema: CommandRunnerConfig,
  });

  const appModule = AppModule.forRoot(configService);

  const app = await CommandFactory.createWithoutRunning(appModule, {
    bufferLogs: true,
  });

  const logger = await app.resolve(NestLoggerService);

  app.useLogger(logger);

  await CommandFactory.runApplication(app);
}

void bootstrap();
