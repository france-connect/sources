import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { AsyncLocalStorageService } from '@fc/async-local-storage';
import { LoggerPluginServiceInterface } from '@fc/logger';

@Injectable()
export class LoggerRequestService implements LoggerPluginServiceInterface {
  constructor(private moduleRef: ModuleRef) {}

  getContext(): Record<string, unknown> {
    const asyncLocalStorageService = this.moduleRef.get(
      AsyncLocalStorageService,
      {
        strict: false,
      },
    );

    const req = asyncLocalStorageService.get('request');

    if (!req) {
      return {};
    }

    const { baseUrl, headers = {}, ip, method, path } = req;
    const context = {
      ip,
      forwardedFor: headers['x-forwarded-for'],
      method,
      path: `${baseUrl}${path}`,
      requestId: headers['x-request-id'],
    };

    return context;
  }
}
