import { CommandFactory } from 'nest-commander';

import { NestJsDependencyInjectionWrapper } from '@fc/common';
import { ConfigService } from '@fc/config';
import { NestLoggerService } from '@fc/logger';

import { AppModule } from './app.module';
import config from './config';
import { ImportSpSandboxConfig } from './dto';

async function bootstrap() {
  const configService = new ConfigService({
    config,
    schema: ImportSpSandboxConfig,
  });

  const appModule = AppModule.forRoot(configService);

  const app = await CommandFactory.createWithoutRunning(appModule, {
    bufferLogs: true,
  });

  const logger = await app.resolve(NestLoggerService);

  app.useLogger(logger);

  NestJsDependencyInjectionWrapper.initiateClassValidator(
    app.select(appModule),
  );

  try {
    console.log('Starting application...');
    await CommandFactory.runApplication(app);
  } catch (error) {
    console.error('An error occurred while running the application', error);
    process.exit(1);
  } finally {
    console.log('Application has finished running');

    await app.close();
    process.exit(0);
  }
}

void bootstrap();
