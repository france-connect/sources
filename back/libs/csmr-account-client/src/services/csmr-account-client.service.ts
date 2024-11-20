import { lastValueFrom, timeout } from 'rxjs';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { FSA } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyFcpService } from '@fc/cryptography-fcp';
import { AccountProtocol } from '@fc/microservices';
import { PivotIdentityDto } from '@fc/oidc';
import { RabbitmqConfig } from '@fc/rabbitmq';

import { CsmrAccountResponseException } from '../exceptions';

@Injectable()
export class CsmrAccountClientService {
  constructor(
    private readonly config: ConfigService,
    @Inject('AccountHighBroker')
    private readonly accountHighBroker: ClientProxy,
    @Inject('AccountLegacyBroker')
    private readonly accountLegacyBroker: ClientProxy,
    private readonly cryptographyFcp: CryptographyFcpService,
  ) {}

  async getAccountIdsFromIdentity(
    identity: PivotIdentityDto,
  ): Promise<string[]> {
    const identityHash = this.cryptographyFcp.computeIdentityHash(identity);

    const accountIdLegacy = await this.getAccountId(
      this.accountLegacyBroker,
      'AccountLegacyBroker',
      identityHash,
    );
    const accountIdHigh = await this.getAccountId(
      this.accountHighBroker,
      'AccountHighBroker',
      identityHash,
    );

    const groupIds = [accountIdLegacy, accountIdHigh].filter(Boolean);

    return groupIds;
  }

  private async getAccountId(
    broker: ClientProxy,
    brokerName: string,
    identityHash: string,
  ): Promise<string | null> {
    const { requestTimeout } = this.config.get<RabbitmqConfig>(brokerName);

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

      if (result === 'ERROR') {
        throw new Error('Received ERROR from consumer');
      }

      const { payload: id } = result;

      return id;
    } catch (error) {
      throw new CsmrAccountResponseException(error);
    }
  }
}
