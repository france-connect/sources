import '@fc/common/overrides/json.parse.override';

import { join } from 'path';

import * as CookieParser from 'cookie-parser';
import { renderFile } from 'ejs';
import helmet from 'helmet';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { NestJsDependencyInjectionWrapper } from '@fc/common';
import { ConfigService } from '@fc/config';
import { NestLoggerService } from '@fc/logger';
import {
  AppConfig,
  MockServiceProviderConfig,
} from '@fc/mock-service-provider';
import { SessionConfig } from '@fc/session';

import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  const configService = new ConfigService({
    config,
    schema: MockServiceProviderConfig,
  });
  const {
    viewsPaths,
    assetsPaths,
    httpsOptions: { key, cert },
  } = configService.get<AppConfig>('App');

  const appModule = AppModule.forRoot(configService);

  const httpsOptions = key && cert ? { cert, key } : null;

  const app = await NestFactory.create<NestExpressApplication>(appModule, {
    httpsOptions,
    bufferLogs: true,
  });

  const logger = await app.resolve(NestLoggerService);

  app.useLogger(logger);
  /**
   * Protect app from common risks
   * @see https://helmetjs.github.io/
   */
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        /**
         * Allow inline CSS and JS
         * @TODO #168 remove this header once the UI is properly implemented
         * to forbid the use of inline CSS or JS
         * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/168
         */
        scriptSrc: ["'self'", "'unsafe-inline'", 'stackpath.bootstrapcdn.com'],
        scriptSrcAttr: ["'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'stackpath.bootstrapcdn.com'],
        /**
         * We should be able to call to any domain that we need (SPs, IdPs, rnipp), the default "self"
         * is too restricting. We don't have a precise domain to restrain to.
         */
        formAction: null,
      },
    }),
  );
  app.use(helmet.permittedCrossDomainPolicies());

  app.engine('ejs', renderFile);

  app.set(
    'views',
    viewsPaths.map((path) => join(__dirname, path, 'views')),
  );
  app.setViewEngine('ejs');

  assetsPaths.forEach((path: string) => {
    app.useStaticAssets(join(__dirname, path, 'public'));
  });

  const { cookieSecrets } = configService.get<SessionConfig>('Session');
  app.use(CookieParser(cookieSecrets));

  NestJsDependencyInjectionWrapper.use(app.select(appModule));

  await app.listen(3000);
}

void bootstrap();
