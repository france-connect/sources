import { timeout } from 'rxjs/operators';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { PartialExcept } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { TracksProtocol } from '@fc/microservices';
import { IOidcIdentity } from '@fc/oidc';
import { RabbitmqConfig } from '@fc/rabbitmq';

import { UserDashboardTracksResponseException } from '../exceptions';

@Injectable()
export class TracksService {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    @Inject('TracksBroker') private readonly broker: ClientProxy,
  ) {}

  getList(
    identity: PartialExcept<IOidcIdentity, 'sub'> | IOidcIdentity,
  ): Promise<unknown> {
    const promise = new Promise((resolve: Function, reject: Function) => {
      const { requestTimeout } =
        this.config.get<RabbitmqConfig>('TracksBroker');

      this.logger.debug('UserTracksController.traces()');

      this.broker
        .send(TracksProtocol.Commands.GET, { identity })
        .pipe(timeout(requestTimeout))
        .subscribe({
          error: (error: Error): void => {
            this.logger.trace(error, 'Error Response from RabbitMQ');
            reject(new UserDashboardTracksResponseException(error));
          },
          next: (data) => {
            this.logger.trace(data, 'Success Response from RabbitMQ');
            resolve(data);
          },
        });
    });

    return promise;
  }
}
