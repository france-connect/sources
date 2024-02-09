import { Observable, tap } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';

import { SessionConfig } from '../dto';
import { ISessionBoundContext, ISessionRequest } from '../interfaces';
import { SessionService } from '../services';

@Injectable()
export class SessionCommitInterceptor implements NestInterceptor {
  constructor(
    private readonly session: SessionService,
    private readonly config: ConfigService,
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

  private async commit(req: ISessionRequest) {
    const sessionContext: ISessionBoundContext = {
      sessionId: req.sessionId,
      moduleName: null,
    };

    const { urlPrefix } = this.config.get<AppConfig>('App');
    const { excludedRoutes } = this.config.get<SessionConfig>('Session');

    const currentRoute = req.route.path.replace(urlPrefix, '');

    if (!excludedRoutes.includes(currentRoute)) {
      await this.session.commit(sessionContext);
    }
  }
}
