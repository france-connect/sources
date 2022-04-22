import { lastValueFrom, map, Observable, timeout } from 'rxjs';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { TracksProtocol } from '@fc/microservices';
import { RabbitmqConfig } from '@fc/rabbitmq';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { CsmrAggregateTracksCsmrFailedException } from '../exceptions';

@Injectable()
export class CmsrAggregateTracksBrokerService {
  brokers: ClientProxy[];

  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    @Inject('TracksHighBroker') private readonly brokerHigh: ClientProxy,
    @Inject('TracksLegacyBroker') private readonly brokerLegacy: ClientProxy,
  ) {
    this.logger.setContext(this.constructor.name);
    this.brokers = [this.brokerHigh, this.brokerLegacy];
  }

  private buildOrder(
    broker: ClientProxy,
    identityHash: string,
  ): Observable<ICsmrTracksOutputTrack[]> {
    const { requestTimeout } = this.config.get<RabbitmqConfig>(
      'AggregateTracksBroker',
    );

    const order$ = broker
      .send<ICsmrTracksOutputTrack[] | 'ERROR'>(TracksProtocol.Commands.GET, {
        identityHash,
      })
      .pipe(
        timeout(requestTimeout),
        /**
         * @todo #825 implement Error protocol
         *
         * Author: Arnaud PSA
         * Date: 22/02/2022
         */
        map((message) => {
          if (message === 'ERROR') {
            throw new CsmrAggregateTracksCsmrFailedException();
          }
          return message;
        }),
      );
    return order$;
  }

  async getTracksGroup(
    identityHash: string,
  ): Promise<ICsmrTracksOutputTrack[][]> {
    this.logger.debug('Grab tracks from brokers');

    const orders$ = this.brokers.map((broker) =>
      this.buildOrder(broker, identityHash),
    );

    const jobs = orders$.map((order) => lastValueFrom(order));

    const data = await Promise.all(jobs);

    this.logger.trace({ data });

    return data;
  }
}
