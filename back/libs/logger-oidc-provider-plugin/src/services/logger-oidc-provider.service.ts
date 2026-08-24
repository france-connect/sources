import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { AsyncLocalStorageService } from '@fc/async-local-storage';
import { LoggerPluginServiceInterface } from '@fc/logger';

import { extractClientId } from '../helpers';

@Injectable()
export class LoggerOidcProviderService implements LoggerPluginServiceInterface {
  constructor(private moduleRef: ModuleRef) {}

  getContext(): Record<string, unknown> {
    const asyncLocalStorageService = this.moduleRef.get(
      AsyncLocalStorageService,
      {
        strict: false,
      },
    );

    const request = asyncLocalStorageService.get('request');

    if (!request) {
      return {};
    }

    const clientId = extractClientId(request);

    return { clientId };
  }
}
