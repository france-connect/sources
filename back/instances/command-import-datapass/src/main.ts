import { CommandFactory } from 'nest-commander';

import { NestJsDependencyInjectionWrapper } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService, NestLoggerService } from '@fc/logger';

import { AppModule } from './app.module';
import config from './config';
import { CommandImportDatapassConfig } from './dto';

async function bootstrap() {
  const configService = new ConfigService({
    config,
    schema: CommandImportDatapassConfig,
  });

  const appModule = AppModule.forRoot(configService);

  const app = await CommandFactory.createWithoutRunning(appModule, {
    bufferLogs: true,
  });

  const nestLogger = await app.resolve(NestLoggerService);
  const logger = await app.resolve(LoggerService);

  app.useLogger(nestLogger);

  NestJsDependencyInjectionWrapper.initiateClassValidator(
    app.select(appModule),
  );

  let exitCode = 0;

  try {
    await CommandFactory.runApplication(app);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));

    logger.alert(
      { context: { reason: err.message, stack: err.stack } },
      'Application failed to run',
    );
    exitCode = 1;
  }

  await app.close();
  process.exit(exitCode);
}

void bootstrap();
