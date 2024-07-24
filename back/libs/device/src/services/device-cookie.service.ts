import { randomBytes } from 'crypto';

import { Request, Response } from 'express';

import { Injectable } from '@nestjs/common';

import { safelyParseJson, validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { DeviceConfig, DeviceCookieDto } from '../dto';
import {
  DeviceCookieInvalidDataException,
  DeviceCookieInvalidJsonException,
} from '../exceptions';

@Injectable()
export class DeviceCookieService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async get(req: Request): Promise<DeviceCookieDto> {
    const { cookieName } = this.config.get<DeviceConfig>('Device');

    const input = req.signedCookies[cookieName];

    let cookie = this.getDefault();

    try {
      if (input) {
        cookie = await this.parseCookie(input);
      }
    } catch (error) {
      this.logger.err('Invalid Device cookie', { error });
      this.logger.debug('Invalid Device cookie', { input });
    }

    return cookie;
  }

  set(res: Response, cookie: DeviceCookieDto) {
    const { cookieName, cookieDomain, identityHmacDailyTtl } =
      this.config.get<DeviceConfig>('Device');

    const cookieValue = Buffer.from(JSON.stringify(cookie)).toString('base64');

    res.cookie(cookieName, cookieValue, {
      secure: true,
      signed: true,
      httpOnly: true,
      sameSite: 'strict',
      domain: cookieDomain,
      // No need to keep the cookie longer than the maximum age of relevant data
      maxAge: identityHmacDailyTtl * 24 * 60 * 60 * 1000,
    });
  }

  private async parseCookie(input: string): Promise<DeviceCookieDto> {
    const decodedInput = Buffer.from(input, 'base64').toString('utf-8');

    let cookie: DeviceCookieDto;
    try {
      cookie = safelyParseJson(decodedInput);
    } catch {
      throw new DeviceCookieInvalidJsonException();
    }

    const errors = await validateDto(cookie, DeviceCookieDto, {
      whitelist: true,
    });

    if (errors.length > 0) {
      throw new DeviceCookieInvalidDataException();
    }

    return cookie;
  }

  private getDefault(): DeviceCookieDto {
    const deviceSalt = this.generateSalt();
    const entries = [];

    return {
      s: deviceSalt,
      e: entries,
    };
  }

  private generateSalt(): string {
    return randomBytes(32).toString('base64');
  }
}
