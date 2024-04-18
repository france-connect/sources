import { Request } from 'express';
import { Observable, tap } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { SessionConfig } from '../dto';
import { SessionService } from '../services';

@Injectable()
export class SessionCommitInterceptor implements NestInterceptor {
  constructor(
    private readonly session: SessionService,
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap({
        next: this.commit.bind(this, req),
        error: this.commit.bind(this, req),
      }),
    );
  }

  private async commit(req: Request) {
    const { urlPrefix } = this.config.get<AppConfig>('App');
    const { middlewareIncludedRoutes } =
      this.config.get<SessionConfig>('Session');

    const currentRoute = req.route.path.replace(urlPrefix, '');

    /**
     * @todo #1551 Fix route paths to avoid any double execution of middlewares
     *
     * Currently some route paths are contained in other route paths, which
     * causes the middleware to be executed multiple times.
     *
     * Example: `/interaction/:uid` is contained in `/interaction/:uid/verify`
     *
     * The temporary fix is to set a dollar sign at the end of the route path that may be contained in another route path.
     * But this results in interceptor not recognizing the route path and not committing the session.
     *
     * We should instead set route names to non ambiguous values.
     */
    const cleanedUpRoutes = this.getCleanedUpRoutes(middlewareIncludedRoutes);

    if (cleanedUpRoutes.includes(currentRoute)) {
      /**
       * @todo #1429 Remove try catch block
       *
       * When we allow SSO on all instances, we will also remove the behavior that removes (detach) totally the session
       * on redirection to the service provider.
       *
       * There would then be no legit reason to enter commit without a proper session.
       * Another way of dealing with this would be to not only detach the session but by init a new empty session.
       */
      try {
        await this.session.commit();
      } catch (error) {
        this.logger.info('Could not commit session from interceptor');
      }
    }
  }

  private getCleanedUpRoutes(routes: (string | RouteInfo)[]): string[] {
    return routes.map((route: string) => route.replace('$', ''));
  }
}
