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
  MockIdentityProviderConfig,
} from '@fc/mock-identity-provider';
import { SessionConfig } from '@fc/session';

import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  const configService = new ConfigService({
    config,
    schema: MockIdentityProviderConfig,
  });
  const {
    httpsOptions: { key, cert },
    assetsPaths,
    viewsPaths,
  } = configService.get<AppConfig>('App');

  const httpsOptions = key && cert ? { key, cert } : null;

  const appModule = AppModule.forRoot(configService);

  const app = await NestFactory.create<NestExpressApplication>(appModule, {
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
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
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
    viewsPaths.map((viewsPath) => {
      return join(__dirname, viewsPath, 'views');
    }),
  );
  app.setViewEngine('ejs');
  assetsPaths.forEach((assetsPath) => {
    app.useStaticAssets(join(__dirname, assetsPath, 'public'));
  });
  const { cookieSecrets } = configService.get<SessionConfig>('Session');
  app.use(CookieParser(cookieSecrets));

  NestJsDependencyInjectionWrapper.use(app.select(appModule));

  await app.listen(3000);
}

void bootstrap();
