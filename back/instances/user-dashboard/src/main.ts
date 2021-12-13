/* istanbul ignore file */

// Not to be tested
import * as CookieParser from 'cookie-parser';
import { urlencoded } from 'express';
import * as helmet from 'helmet';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { SessionConfig } from '@fc/session';
import { UserDashboardConfig } from '@fc/user-dashboard';

import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  const configService = new ConfigService({
    config,
    schema: UserDashboardConfig,
  });
  const {
    httpsOptions: { cert, key },
    urlPrefix,
  } = configService.get<AppConfig>('App');

  const appModule = AppModule.forRoot(configService);

  const httpsOptions = key && cert ? { cert, key } : null;

  const app = await NestFactory.create<NestExpressApplication>(appModule, {
    /**
     * We need to handle the bodyParser ourself because of prototype pollution risk with `body-parser` library.
     *
     * Track the handling of this issue on `body-parser` repositoty:
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
  });

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
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: ["'self'", "'unsafe-inline'"],
        /**
         * Allow inline CSS and JS
         * @TODO #168 remove this header once the UI is properly implemented
         * to forbid the use of inline CSS or JS
         * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/168
         */
        styleSrc: ["'self'", "'unsafe-inline'"],
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
   * Desactivate extended "qs" parser to prevent prototype pollution hazard.
   * @see body-parser.md in the project doc folder for further informations.
   */
  app.use(urlencoded({ extended: false }));

  const logger = await app.resolve(LoggerService);
  app.useLogger(logger);

  const { cookieSecrets } = configService.get<SessionConfig>('Session');
  app.use(CookieParser(cookieSecrets));

  await app.listen(3000);
}
bootstrap();
