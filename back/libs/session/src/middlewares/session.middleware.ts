import { Request, Response } from 'express';

import { Injectable, NestMiddleware } from '@nestjs/common';

import { ConfigService } from '@fc/config';

import { SessionConfig } from '../dto';
import { SessionService } from '../services';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(
    private readonly config: ConfigService,
    private readonly session: SessionService,
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    await this.handleSession(req, res);

    next();
  }

  private async handleSession(req: Request, res: Response) {
    const { slidingExpiration } = this.config.get<SessionConfig>('Session');
    const sessionId = this.session.getSessionIdFromCookie(req);

    if (!sessionId) {
      return this.session.init(res);
    }

    try {
      await this.session.initCache(sessionId);
    } catch (error) {
      return this.session.init(res);
    }

    if (slidingExpiration) {
      await this.session.refresh(req, res);
    }
  }
}
