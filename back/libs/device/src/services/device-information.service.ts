import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { SessionService } from '@fc/session';

import { DeviceConfig, DeviceSession, DeviceUserEntry } from '../dto';
import { DeviceInformationInterface } from '../interfaces';

@Injectable()
export class DeviceInformationService {
  constructor(
    private readonly config: ConfigService,
    private readonly session: SessionService,
  ) {}

  extract(
    userEntry: DeviceUserEntry,
    oldEntries: DeviceUserEntry[],
    newEntries: DeviceUserEntry[],
  ): DeviceInformationInterface {
    const { maxIdentityNumber, maxIdentityTrusted, identityHmacDailyTtl } =
      this.config.get<DeviceConfig>('Device');
    const { isSuspicious } = this.session.get<DeviceSession>('Device');

    const accountCount = newEntries.length;

    const shared = this.isShared(oldEntries);
    const isTrusted = this.isTrusted(oldEntries);
    const knownDevice = this.isKnowDevice(oldEntries);
    const newIdentity = this.isNewIdentity(oldEntries, userEntry);
    const sharedBecameTrusted = this.sharedBecameTrusted(
      accountCount,
      oldEntries,
      maxIdentityTrusted,
    );
    const becameTrusted = this.becameTrusted(knownDevice, sharedBecameTrusted);
    const becameShared = this.becameShared(
      oldEntries,
      newEntries,
      maxIdentityTrusted,
    );

    return {
      isTrusted,
      shared,
      isSuspicious,

      maxIdentityNumber,
      maxIdentityTrusted,
      identityHmacDailyTtl,

      accountCount,
      knownDevice,
      newIdentity,
      becameTrusted,
      becameShared,
    };
  }

  isShared(entries: DeviceUserEntry[]): boolean {
    const { maxIdentityTrusted } = this.config.get<DeviceConfig>('Device');

    return entries.length > maxIdentityTrusted;
  }

  isTrusted(entries: DeviceUserEntry[]): boolean {
    const { maxIdentityTrusted } = this.config.get<DeviceConfig>('Device');

    return entries.length > 0 && entries.length <= maxIdentityTrusted;
  }

  isKnowDevice(oldEntries: DeviceUserEntry[]): boolean {
    return oldEntries.length > 0;
  }

  isNewIdentity(
    oldEntries: DeviceUserEntry[],
    userEntry: DeviceUserEntry,
  ): boolean {
    return !oldEntries.some(({ h: hmac }) => hmac === userEntry.h);
  }

  sharedBecameTrusted(
    accountCount: number,
    oldEntries: DeviceUserEntry[],
    maxIdentityTrusted: number,
  ): boolean {
    return (
      oldEntries.length > maxIdentityTrusted &&
      accountCount <= maxIdentityTrusted
    );
  }

  becameTrusted(knownDevice: boolean, sharedBecameTrusted: boolean): boolean {
    return !knownDevice || sharedBecameTrusted;
  }

  becameShared(
    oldEntries: DeviceUserEntry[],
    newEntries: DeviceUserEntry[],
    maxIdentityTrusted: number,
  ): boolean {
    return (
      oldEntries.length === maxIdentityTrusted &&
      newEntries.length > maxIdentityTrusted
    );
  }
}
