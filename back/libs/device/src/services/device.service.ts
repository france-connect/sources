import { Request, Response } from 'express';

import { Injectable } from '@nestjs/common';

import { IOidcIdentity } from '@fc/oidc';
import { SessionService } from '@fc/session';

import { DeviceCookieDto, DeviceSession } from '../dto';
import { DeviceInformationInterface } from '../interfaces';
import { DeviceCookieService } from './device-cookie.service';
import { DeviceEntriesService } from './device-entries.service';
import { DeviceHeaderFlagsService } from './device-header-flags.service';
import { DeviceInformationService } from './device-information.service';

@Injectable()
export class DeviceService {
  // Allowed fo DI in constructors
  // eslint-disable-next-line max-params
  constructor(
    private readonly session: SessionService,
    private readonly cookie: DeviceCookieService,
    private readonly entries: DeviceEntriesService,
    private readonly infos: DeviceInformationService,
    private readonly headerFlags: DeviceHeaderFlagsService,
  ) {}

  async update(
    req: Request,
    res: Response,
    identity: Partial<Omit<IOidcIdentity, 'sub'>>,
  ): Promise<DeviceInformationInterface> {
    const { s: deviceSalt, e: oldEntries } = await this.getDeviceCookie(req);

    // Compute new informations
    const entry = this.entries.generate(identity, deviceSalt, oldEntries);
    const newEntries = this.entries.push(oldEntries, entry);

    // Extract modification informations
    const report = this.infos.extract(entry, oldEntries, newEntries);

    // Update persisted information
    const { accountCount, isSuspicious, isTrusted } = report;
    const deviceSession: DeviceSession = {
      accountCount,
      isSuspicious,
      isTrusted,
    };
    this.session.set('Device', deviceSession);
    this.cookie.set(res, { s: deviceSalt, e: newEntries });

    return report;
  }

  async initSession(req: Request) {
    const isSuspicious = this.headerFlags.isSuspicious(req);

    const { e: oldEntries } = await this.getDeviceCookie(req);

    const accountCount = oldEntries.length;
    const isTrusted = this.infos.isTrusted(oldEntries);

    const deviceSession: DeviceSession = {
      accountCount,
      isSuspicious,
      isTrusted,
    };

    this.session.set('Device', deviceSession);
  }

  private async getDeviceCookie(req: Request): Promise<DeviceCookieDto> {
    const { s, e: oldEntries } = await this.cookie.get(req);
    const validEntries = this.entries.filterValidEntries(oldEntries);
    const deviceCookie = {
      s,
      e: validEntries,
    };
    return deviceCookie;
  }
}
