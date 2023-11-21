import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';

import { AppConfig } from '../dto';

@Injectable()
export class MockDataProviderService {
  constructor(private readonly config: ConfigService) {}

  authenticateServiceProvider(receivedSecret): void | never {
    const { apiAuthSecret } = this.config.get<AppConfig>('App');

    if (apiAuthSecret !== receivedSecret) {
      throw {
        error: 'authentication_error',
        message: 'Invalid credentials',
        httpStatusCode: 401,
      };
    }
  }
}
