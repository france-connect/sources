import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ValidationException } from '@fc/exceptions';
import {
  BridgeError,
  BridgeProtocol,
  BridgeResponse,
  MessageType,
} from '@fc/hybridge-http-proxy';
import { LoggerService } from '@fc/logger';
import { HttpProxyProtocol } from '@fc/microservices';

import { BridgePayloadDto } from '../dto';
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
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
      exceptionFactory: ValidationException.factory,
    }),
  )
  async proxyRequest(
    @Payload() payload: BridgePayloadDto,
  ): Promise<BridgeProtocol<BridgeResponse | BridgeError>> {
    this.logger.debug(
      `received new ${HttpProxyProtocol.Commands.HTTP_PROXY} command`,
    );

    this.logger.trace({ payload });

    let response;
    try {
      const data = await this.proxy.forwardRequest(payload);

      response = {
        type: MessageType.DATA,
        data,
      };
    } catch (error) {
      this.logger.error(error);
      response = this.formatError(error);
    }

    this.logger.trace({ response });

    return response;
  }

  formatError(error: Error): BridgeProtocol<BridgeError> {
    this.logger.debug('build error message from internal Error');
    const { message: reason, name } = error;
    /**
     * @todo #825
     * Gestion des erreurs améliorée attendues avec code et documentation
     *
     * Author: Arnaud PSA
     * Date: 02/12/21
     */
    const { code = 1000 } = error as any;
    const response = {
      type: MessageType.ERROR,
      data: {
        reason,
        name,
        code,
      },
    };

    return response;
  }
}
