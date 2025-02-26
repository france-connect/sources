import { lastValueFrom, timeout } from 'rxjs';
import { Class } from 'type-fest';

import { Injectable, Type } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { FSA, getValidDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { MicroservicesRmqConfig } from '../dto';
import { ResponseStatus } from '../enums';
import {
  MicroservicesRmqCommunicationException,
  MicroservicesRmqResponseException,
  MicroservicesRmqResponseNoPayloadException,
  MicroservicesRmqValidationException,
} from '../exceptions';
import { getServiceToken } from '../helpers';
import { MicroservicesRmqErrorInterface } from '../interfaces';

@Injectable()
export class MicroservicesRmqPublisherService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly broker: ClientProxy,
    private readonly serviceName: string,
  ) {}

  async publish<Message, Result extends FSA>(
    command: string,
    payload: Message,
    responseDto?: Class<Result>,
    validationOptions?: unknown,
  ): Promise<Result> {
    const serviceName = getServiceToken(this.serviceName);

    const { requestTimeout } =
      this.config.get<MicroservicesRmqConfig>(serviceName);

    let result: Result | MicroservicesRmqErrorInterface;
    this.logger.debug(`Publishing message ${command}`);

    try {
      const message = this.broker
        .send<Result, Message>(command, payload)
        .pipe(timeout(requestTimeout));

      result = await lastValueFrom<Result | MicroservicesRmqErrorInterface>(
        message,
      );
      this.logger.debug({ msg: 'Received response', result });
    } catch (error) {
      if (error?.type === ResponseStatus.FAILURE) {
        throw new MicroservicesRmqResponseException(error);
      }

      throw new MicroservicesRmqCommunicationException(error);
    }

    const success = this.getSuccess<Result>(result);

    const validated = this.getValidatedResponse<Result>(
      success,
      responseDto,
      validationOptions,
    );

    return validated;
  }

  private async getValidatedResponse<Result>(
    result: Result,
    dto?: Type<object>,
    validationOptions?: unknown,
  ): Promise<Result> {
    if (dto) {
      const transformed = await getValidDto(result, dto, validationOptions);
      if (transformed instanceof Array) {
        throw new MicroservicesRmqValidationException(transformed);
      }

      return transformed as Result;
    }

    return result;
  }

  private getSuccess<Result extends FSA>(
    result: Result | MicroservicesRmqErrorInterface,
  ): Result {
    if (!result.payload) {
      throw new MicroservicesRmqResponseNoPayloadException();
    }

    return result as Result;
  }
}
