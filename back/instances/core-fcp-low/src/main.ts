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
    assetsCacheTtl,
    assetsUrlPrefix,
    assetsUrlDomain,
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

  const directives: Record<string, string[]> = {
    /**
     * We should be able to call to any domain that we need (SPs, IdPs, rnipp), the default "self"
     * is too restricting. We don't have a precise domain to restrain to.
     */
    formAction: null,
  };

  if (assetsUrlDomain) {
    directives.scriptSrc = ["'self'", assetsUrlDomain];
    directives.styleSrc = ["'self'", assetsUrlDomain];
    directives.imgSrc = ["'self'", 'data:', assetsUrlDomain];
    directives.fontSrc = ["'self'", assetsUrlDomain];
  }

  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives,
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

  assetsPaths.forEach((assetsPath) => {
    app.useStaticAssets(join(__dirname, assetsPath, 'public'), {
      maxAge: assetsCacheTtl * 1000,
      prefix: assetsUrlPrefix,
    });
  });

  const { cookieSecrets } = configService.get<SessionConfig>('Session');
  app.use(CookieParser(cookieSecrets));

  NestJsDependencyInjectionWrapper.use(app.select(appModule));

  await app.listen(3000);
}

void bootstrap();
