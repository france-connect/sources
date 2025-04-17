import '@fc/common/overrides/json.parse.override';

import { join } from 'path';

import * as CookieParser from 'cookie-parser';
import { renderFile } from 'ejs';
import helmet from 'helmet';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppConfig } from '@fc/app';
import { NestJsDependencyInjectionWrapper } from '@fc/common';
import { ConfigService } from '@fc/config';
import { NestLoggerService } from '@fc/logger';
import { SessionConfig } from '@fc/session';

import { AppModule } from './app.module';
import config from './config';
import { CoreFcpLowConfig } from './dto';

async function bootstrap() {
  const configService = new ConfigService({
    config,
    schema: CoreFcpLowConfig,
  });
  const {
    urlPrefix,
    assetsPaths,
    assetsDsfrPaths,
    assetsCacheTtl,
    viewsPaths,
    httpsOptions: { key, cert },
  } = configService.get<AppConfig>('App');

  const appModule = AppModule.forRoot(configService);

  const httpsOptions = key && cert ? { key, cert } : null;

  const app = await NestFactory.create<NestExpressApplication>(appModule, {
    httpsOptions,
    bufferLogs: true,
  });

  const logger = await app.resolve(NestLoggerService);

  app.useLogger(logger);

  app.setGlobalPrefix(urlPrefix);
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
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        /**
         * We should be able to call to any domain that we need (SPs, IdPs, rnipp), the default "self"
         * is too restricting. We don't have a precise domain to restrain to.
         */
        formAction: null,
      },
    }),
  );
  app.use(helmet.permittedCrossDomainPolicies());

  app.setViewEngine('ejs');
  app.engine('ejs', renderFile);
  app.set(
    'views',
    viewsPaths.map((viewsPath) => {
      return join(__dirname, viewsPath, 'views');
    }),
  );

  /**
   * @TODO #1203 All below useStaticAssets functions need to be removed (until line 146) when webpack has been configured to load assets from @gouvfr/dsfr package
   * @ticket FC-1203
   */
  assetsDsfrPaths.forEach(({ assetPath, prefix }) => {
    app.useStaticAssets(join(__dirname, assetPath), {
      maxAge: assetsCacheTtl * 1000,
      prefix,
    });
  });

  assetsPaths.forEach((assetsPath) => {
    app.useStaticAssets(join(__dirname, assetsPath, 'public'), {
      maxAge: assetsCacheTtl * 1000,
    });
  });

  const { cookieSecrets } = configService.get<SessionConfig>('Session');
  app.use(CookieParser(cookieSecrets));

  NestJsDependencyInjectionWrapper.use(app.select(appModule));

  await app.listen(3000);
}

void bootstrap();
