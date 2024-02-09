import { Injectable, NestMiddleware } from '@nestjs/common';

import { AsyncLocalStorageService } from '@fc/async-local-storage';
import { ConfigService } from '@fc/config';

import { SessionConfig } from '../dto';
import { ISessionRequest, SessionStoreInterface } from '../interfaces';
import { SessionService } from '../services';
import { SESSION_STORE_KEY } from '../tokens';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(
    private readonly config: ConfigService,
    private readonly sessionService: SessionService,
    private readonly asyncLocalStorage: AsyncLocalStorageService<SessionStoreInterface>,
  ) {}

  async use(req: ISessionRequest, res: Response, next: () => void) {
    this.asyncLocalStorage.set(SESSION_STORE_KEY, {
      data: null,
      sync: false,
      id: null,
    });

    await this.handleSession(req, res);

    next();
  }

  private async handleSession(req, res) {
    const cookieSessionId = this.sessionService.getSessionIdFromCookie(req);
    const { slidingExpiration } = this.config.get<SessionConfig>('Session');

    if (slidingExpiration && cookieSessionId) {
      await this.sessionService.refresh(req, res);
    } else if (!cookieSessionId) {
      this.sessionService.init(req, res);
    } else {
      this.sessionService.bindToRequest(req, cookieSessionId);
    }
  }
}
