import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { LoggerService } from '@fc/logger';

import { IEventContext, IEventMap } from '../interfaces';
import { TrackingService } from '../tracking.service';

@Injectable()
export class TrackingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: LoggerService,
    private readonly tracking: TrackingService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    this.logger.debug(`${req.method}/ ${req.path}`);

    return next.handle().pipe(tap(this.log.bind(this, req)));
  }

  private log(req: IEventContext): void {
    const event = this.getEvent(req, this.tracking.EventsMap);

    if (event) {
      this.tracking.log(event, { req });
    }
  }

  private getEvent(req, events: IEventMap) {
    const {
      route: { path },
    } = req;
    return Object.entries(events)
      .map(([, event]) => event)
      .filter(({ intercept }) => intercept)
      .find((event) => event.route === path);
  }
}
