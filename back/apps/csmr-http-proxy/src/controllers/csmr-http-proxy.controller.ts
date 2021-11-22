import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ValidationException } from '@fc/exceptions';
import { LoggerService } from '@fc/logger';
import { HttpProxyProtocol } from '@fc/microservices';

import { BridgePayloadDto } from '../dto';
import { HttpProxyRequest, HttpProxyResponse } from '../interfaces';
import { CsmrHttpProxyService } from '../services';

@Controller()
export class CsmrHttpProxyController {
  constructor(
    private readonly logger: LoggerService,
    private readonly proxy: CsmrHttpProxyService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @MessagePattern(HttpProxyProtocol.Commands.HTTP_PROXY)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: ValidationException.factory,
    }),
  )
  async proxyRequest(
    @Payload() payload: BridgePayloadDto,
  ): Promise<HttpProxyResponse> {
    this.logger.debug(
      `received new ${HttpProxyProtocol.Commands.HTTP_PROXY} command`,
    );

    const { url, method, headers, data } = payload;

    /**
     * @todo add Proxy and HttpsAgent options
     * the call to FI RIE will require proxy and https options to work
     * Author: Arnaud PSA
     * Date: 21/10/21
     */

    const options: HttpProxyRequest = {
      url,
      method,
      responseType: 'json',
      headers,
    };

    if (data) {
      options.data = data;
    }

    /**
     * @todo gestion de 3 cas d'erreur:
     * - le RMQ est mal formatté
     * - le FI renvoie une erreur HTTP
     * - le FI est injoignable (échec proxy, timeout réseaux...)
     */

    try {
      return this.proxy.forwardRequest(options);
    } catch (error) {
      this.logger.error(error);
      return {
        status: 500,
        message: error.message,
      };
    }
  }
}
