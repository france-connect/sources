import '@fc/common/overrides/json.parse.override';

import { join } from 'path';

import * as CookieParser from 'cookie-parser';
import { renderFile } from 'ejs';
import { urlencoded } from 'express';
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
    /**
     * We need to handle the bodyParser ourselves because of prototype pollution risk with `body-parser` library.
     *
     * Track the handling of this issue on `body-parser` repository:
     * @see https://github.com/expressjs/body-parser/issues/347
     *
     * Description of the vulnerability:
     * @see https://gist.github.com/rgrove/3ea9421b3912235e978f55e291f19d5d/revisions
     *
     * More general explanation about prototype pollution/poising:
     * @see https://medium.com/intrinsic/javascript-prototype-poisoning-vulnerabilities-in-the-wild-7bc15347c96
     */
    bodyParser: false,
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

  /**
   * The security concern is on bodyParser.json (see upper comment).
   * In the application, only the "urlencoded" form is necessary.
   * therefore, we only activate the "body.urlencoded" middleware
   *
   * JSON parsing exists in our app, but it is handled by `jose`.
   *
   * Deactivate extended "qs" parser to prevent prototype pollution hazard.
   * @see body-parser.md in the project doc folder for further information.
   */
  app.use(urlencoded({ extended: false }));

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
