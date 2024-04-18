import { Request, Response } from 'express';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';

import { SessionConfig } from '../dto';
import { SessionBadCookieException } from '../exceptions';

@Injectable()
export class SessionCookiesService {
  constructor(private readonly config: ConfigService) {}

  get(req: Request): string | undefined {
    const { sessionCookieName } = this.config.get<SessionConfig>('Session');

    const sessionId = req.signedCookies[sessionCookieName];

    if (sessionId && typeof sessionId !== 'string') {
      throw new SessionBadCookieException();
    }

    return sessionId;
  }

  set(res: Response, sessionId: string): void {
    const { cookieOptions, sessionCookieName } =
      this.config.get<SessionConfig>('Session');

    res.cookie(sessionCookieName, sessionId, cookieOptions);
  }

  remove(res: Response) {
    const { cookieOptions, sessionCookieName } =
      this.config.get<SessionConfig>('Session');

    const removeCookieOptions = {
      ...cookieOptions,
      maxAge: -1,
      signed: false, // Not mandatory, but avoids sending a signature for an empty cookie
    };

    res.clearCookie(sessionCookieName, removeCookieOptions);
  }
}
