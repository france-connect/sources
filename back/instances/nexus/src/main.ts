import '@fc/common/overrides/json.parse.override';

import helmet from 'helmet';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppConfig } from '@fc/app';
import { NestJsDependencyInjectionWrapper } from '@fc/common';
import { ConfigService } from '@fc/config';
import { NestLoggerService } from '@fc/logger';
import { NexusConfigDto } from '@fc/nexus';

import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  const configService = new ConfigService({
    config,
    schema: NexusConfigDto,
  });
  const {
    httpsOptions: { cert, key },
    urlPrefix,
  } = configService.get<AppConfig>('App');

  const appModule = AppModule.forRoot(configService);

  const httpsOptions = key && cert ? { cert, key } : null;

  const app = await NestFactory.create<NestExpressApplication>(appModule, {
    httpsOptions,
    bufferLogs: true,
  });

  const logger = await app.resolve(NestLoggerService);
  app.useLogger(logger);

  app.set('query parser', 'simple');

  app.setGlobalPrefix(urlPrefix);
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        formAction: null,
      },
    }),
  );
  app.use(helmet.permittedCrossDomainPolicies());

  NestJsDependencyInjectionWrapper.use(app.select(appModule));

  await app.listen(3000);
}

void bootstrap();
