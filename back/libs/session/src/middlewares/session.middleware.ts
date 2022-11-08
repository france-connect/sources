import { Injectable, NestMiddleware } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { ISessionRequest } from '../interfaces';
import { SessionService } from '../services';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly sessionService: SessionService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async use(req: ISessionRequest, res: Response, next: () => void) {
    await this.handleSession(req, res);

    next();
  }

  private async handleSession(req, res) {
    const cookieSessionId = this.sessionService.getSessionIdFromCookie(req);

    if (!cookieSessionId) {
      await this.sessionService.init(req, res);
    } else {
      await this.sessionService.refresh(req, res);
    }
  }
}
