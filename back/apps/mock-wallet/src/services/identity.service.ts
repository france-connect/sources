import { basename } from 'path';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { AppConfig, WalletPidCsvDto } from '../dto';
import { MockWalletIdentityNotFoundException } from '../exceptions';
import { listCsvFiles, parseCsvFile } from '../helpers';
import { WalletIdentity } from '../interfaces';

@Injectable()
export class IdentityService {
  private identities: WalletIdentity[] = [];

  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async onModuleInit(): Promise<void> {
    const { identitiesCsvPath } = this.config.get<AppConfig>('App');

    const files = await listCsvFiles(identitiesCsvPath);

    const loaded = await Promise.all(files.map((file) => this.loadFile(file)));

    this.identities = loaded.flat();

    this.logger.notice(`Loaded ${this.identities.length} mock identities`);
  }

  getIdentities(): WalletIdentity[] {
    return this.identities;
  }

  getIdentity(index: number): WalletIdentity {
    const identity = this.identities[index];

    if (!identity) {
      throw new MockWalletIdentityNotFoundException();
    }

    return identity;
  }

  private async loadFile(path: string): Promise<WalletIdentity[]> {
    const docType = basename(path, '.csv');

    const rows = await parseCsvFile(path, WalletPidCsvDto);

    return rows.map((attributes) => ({
      docType,
      attributes: { ...attributes },
    }));
  }
}
