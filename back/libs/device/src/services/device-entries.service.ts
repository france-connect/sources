import { createHmac } from 'crypto';

import { DateTime } from 'luxon';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { IOidcIdentity } from '@fc/oidc';

import { DeviceConfig, DeviceUserEntry } from '../dto';

@Injectable()
export class DeviceEntriesService {
  constructor(private readonly config: ConfigService) {}

  generate(
    identity: Partial<Omit<IOidcIdentity, 'sub'>>,
    deviceSalt: string,
    oldEntries: DeviceUserEntry[],
  ): DeviceUserEntry {
    const { identityHmacDailyTtl } = this.config.get<DeviceConfig>('Device');

    const hash = this.findCorrectHash(identity, deviceSalt, oldEntries);

    const timestamp = DateTime.now()
      .plus({ days: identityHmacDailyTtl })
      .toMillis();

    return {
      h: hash,
      d: timestamp,
    };
  }

  filterValidEntries(entries: DeviceUserEntry[]): DeviceUserEntry[] {
    const validEntries = entries.filter(this.isNotExpired.bind(this));
    return validEntries;
  }

  push(entries: DeviceUserEntry[], entry: DeviceUserEntry): DeviceUserEntry[] {
    const { maxIdentityNumber } = this.config.get<DeviceConfig>('Device');
    let newEntries = Array.from(entries);

    // filter on expired date
    newEntries = this.filterValidEntries(newEntries);

    // filter on current user
    newEntries = newEntries.filter(({ h }) => h !== entry.h);

    newEntries.push(entry);

    newEntries = newEntries.slice(-maxIdentityNumber);

    return newEntries;
  }

  private isNotExpired = function isExpired({ d: trustExpirationDate }) {
    const now = Date.now();

    return now < trustExpirationDate;
  };

  private findCorrectHash(
    identity: Partial<Omit<IOidcIdentity, 'sub'>>,
    deviceSalt: string,
    oldEntries: DeviceUserEntry[],
  ): string {
    const { identityHmacSecret } = this.config.get<DeviceConfig>('Device');

    let firstHash: string;

    for (const secret of identityHmacSecret) {
      const hash = this.hashIdentity(identity, secret, deviceSalt);

      if (this.isHashInEntries(oldEntries, hash)) {
        return hash;
      }

      if (!firstHash) {
        firstHash = hash;
      }
    }

    return firstHash;
  }

  private hashIdentity(
    identity: Partial<Omit<IOidcIdentity, 'sub'>>,
    secret: string,
    deviceSalt: string,
  ): string {
    const { identityHashSourceProperties } =
      this.config.get<DeviceConfig>('Device');

    const value = identityHashSourceProperties
      .map((property) => identity[property])
      .join('');

    const salt = `${deviceSalt}${secret}`;

    const hash = createHmac('sha256', salt).update(value).digest('base64');

    return hash;
  }

  private isHashInEntries(entries: DeviceUserEntry[], hash: string): boolean {
    return entries.some((entry) => entry.h === hash);
  }
}
