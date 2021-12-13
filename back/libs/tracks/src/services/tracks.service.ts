import { lastValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { TracksProtocol } from '@fc/microservices';
import { IOidcIdentity } from '@fc/oidc';
import { RabbitmqConfig } from '@fc/rabbitmq';

import { TrackDto } from '../dto';
import { TracksResponseException } from '../exceptions';

@Injectable()
export class TracksService {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    @Inject('TracksBroker') private readonly broker: ClientProxy,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async getList(identity: Partial<IOidcIdentity>): Promise<TrackDto[]> {
    const { requestTimeout } = this.config.get<RabbitmqConfig>('TracksBroker');

    this.logger.debug('UserTracksController.traces()');

    try {
      const order = this.broker
        .send(TracksProtocol.Commands.GET, { identity })
        .pipe(timeout(requestTimeout));

      const data = await lastValueFrom(order);
      return data;
    } catch (error) {
      this.logger.trace(error, 'Error Response from RabbitMQ');
      throw new TracksResponseException(error);
    }
  }
}
