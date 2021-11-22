import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { SessionConfig } from '../dto';
import { ISessionRequest } from '../interfaces';
import { SessionService } from '../services';
import { ExcludedRoutes } from '../types';

@Injectable()
export class SessionInterceptor implements NestInterceptor {
  private excludedRoutes: ExcludedRoutes;

  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly sessionService: SessionService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  onModuleInit() {
    const { excludedRoutes } = this.config.get<SessionConfig>('Session');

    this.excludedRoutes = excludedRoutes;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const req = context.switchToHttp().getRequest();
    const isHandleSession = this.sessionService.shouldHandleSession(
      req.route.path,
      this.excludedRoutes,
    );

    if (isHandleSession) {
      const res = context.switchToHttp().getResponse();
      await this.handleSession(req, res);
    }

    return next.handle();
  }

  private async handleSession(req: ISessionRequest, res) {
    const cookieSessionId = this.sessionService.getSessionIdFromCookie(req);

    if (!cookieSessionId) {
      this.sessionService.init(req, res);
    } else {
      await this.sessionService.refresh(req, res);
    }
  }
}
