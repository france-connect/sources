import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestMethod,
} from '@nestjs/common';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import {
  InterceptRouteInterface,
  TrackedEventContextInterface,
  TrackedEventMapType,
} from '../interfaces';
import { TrackingService } from '../services';

@Injectable()
export class TrackingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: LoggerService,
    private readonly tracking: TrackingService,
    private readonly config: ConfigService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    this.logger.trace(`interceptor`);

    const { urlPrefix } = this.config.get<AppConfig>('App');

    return next.handle().pipe(tap(this.log.bind(this, req, urlPrefix)));
  }

  private log(req: TrackedEventContextInterface, urlPrefix: string): void {
    const event = this.getEvent(req, this.tracking.TrackedEventsMap, urlPrefix);

    this.logger.trace({ event, events: this.tracking.TrackedEventsMap });
    if (event) {
      this.tracking.track(event, { req });
    }
  }

  private getEvent(req, events: TrackedEventMapType, urlPrefix: string) {
    return Object.values(events).find((event) => {
      if (!event.interceptRoutes) {
        return false;
      }

      const matches = event.interceptRoutes.find(
        this.isMatchingRoute.bind(null, req, urlPrefix),
      );

      return matches;
    });
  }

  private isMatchingRoute(
    req: Request,
    urlPrefix: string,
    { method, path }: InterceptRouteInterface,
  ): boolean {
    const currentMethod = RequestMethod[req.method];
    const matchMethod =
      method === currentMethod || method === RequestMethod.ALL;
    const matchPath = `${urlPrefix}${path}` === req.route.path;

    return matchMethod && matchPath;
  }
}
