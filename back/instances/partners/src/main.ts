import '@fc/common/overrides/json.parse.override';

import * as CookieParser from 'cookie-parser';
import helmet from 'helmet';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppConfig } from '@fc/app';
import { NestJsDependencyInjectionWrapper } from '@fc/common';
import { ConfigService } from '@fc/config';
import { NestLoggerService } from '@fc/logger';
import { PartnersConfig } from '@fc/partners';
import { SessionConfig } from '@fc/session';

import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  const configService = new ConfigService({
    config,
    schema: PartnersConfig,
  });
  const {
    httpsOptions: { cert, key },
    urlPrefix,
  } = configService.get<AppConfig>('App');

  const appModule = AppModule.forRoot(configService);

  const httpsOptions = key && cert ? { cert, key } : null;

  const app = await NestFactory.create<NestExpressApplication>(appModule, {
    /** Activate rawBody for webhooks calls signature */
    rawBody: true,
    httpsOptions,
    bufferLogs: true,
  });

  const logger = await app.resolve(NestLoggerService);
  app.useLogger(logger);

  /**
   * @see https://expressjs.com/fr/api.html#app.set
   * @see https://github.com/expressjs/express/issues/3361
   */
  app.set('query parser', 'simple');

  /**
   * Protect app from common risks
   * @see https://helmetjs.github.io/
   */
  app.setGlobalPrefix(urlPrefix);
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      /**
       * We should be able to call to any domain that we need (SPs, IdPs, rnipp), the default "self"
       * is too restricting. We don't have a precise domain to restrain to.
       */
      directives: {
        formAction: null,
      },
    }),
  );
  app.use(helmet.permittedCrossDomainPolicies());

  const { cookieSecrets } = configService.get<SessionConfig>('Session');
  app.use(CookieParser(cookieSecrets));

  NestJsDependencyInjectionWrapper.use(app.select(appModule));

  await app.listen(3000);
}

void bootstrap();
