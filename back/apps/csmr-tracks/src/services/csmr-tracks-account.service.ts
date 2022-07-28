import { lastValueFrom, timeout } from 'rxjs';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { FSA } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { AccountProtocol } from '@fc/microservices';
import { RabbitmqConfig } from '@fc/rabbitmq';

import { CsmrTracksAccountResponseException } from '../exceptions';

@Injectable()
export class CsmrTracksAccountService {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    @Inject('AccountHighBroker')
    private readonly accountHighBroker: ClientProxy,
    @Inject('AccountLegacyBroker')
    private readonly accountLegacyBroker: ClientProxy,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async getIdsWithIdentityHash(identityHash: string): Promise<string[]> {
    const accountIdLegacy = await this.getAccountId(
      this.accountLegacyBroker,
      identityHash,
    );
    const accountIdHigh = await this.getAccountId(
      this.accountHighBroker,
      identityHash,
    );

    const groupIds = [accountIdLegacy, accountIdHigh].filter(Boolean);
    this.logger.trace({ groupIds });

    return groupIds;
  }

  private async getAccountId(
    broker: ClientProxy,
    identityHash: string,
  ): Promise<string | null> {
    const { requestTimeout } = this.config.get<RabbitmqConfig>('TracksBroker');

    /**
     * @todo #825 microservice wrapping
     */
    try {
      const order = broker
        .send<FSA<undefined, string>>(AccountProtocol.Commands.GET_ACCOUNT_ID, {
          identityHash,
        })
        .pipe(timeout(requestTimeout));

      const result = await lastValueFrom<FSA<undefined, string> | 'ERROR'>(
        order,
      );

      this.logger.trace({ identityHash, result });

      if (result === 'ERROR') {
        throw new Error('Received ERROR from consumer');
      }

      const { payload: id } = result;

      return id;
    } catch (error) {
      this.logger.trace(error, 'Error Response from RabbitMQ');
      throw new CsmrTracksAccountResponseException(error);
    }
  }
}
