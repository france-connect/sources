import { bootstrap } from 'global-agent';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger';

@Injectable()
export class HttpProxyService {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpService: HttpService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Set up `global-agent`
   * @see https://www.npmjs.com/package/global-agent#runtime-configuration
   * This applies proxy rules on all libraries
   * that use the NodeJS request library.
   * It silently adds proxy management in all requests in applications.
   */
  onModuleInit() {
    // Instanciate proxy params for Got library and basic NodeJS Request
    // Activate the GLOBAL_AGENT_HTTP(S)_PROXY env variable on proxy settings
    bootstrap();

    this.logger.debug(
      `Set up HTTPS proxy to: ${globalThis['GLOBAL_AGENT'].HTTPS_PROXY}`,
    );

    // Force Axios to not use Proxy Request library for RNIPP calls
    this.httpService.axiosRef.defaults.proxy = false;
  }
}
