import { lastValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { ConfigService } from '@fc/config';
import { FraudProtocol } from '@fc/microservices';
import { IOidcIdentity } from '@fc/oidc';
import { RabbitmqConfig } from '@fc/rabbitmq';

import { FraudCaseDto } from '../dto';
import { CsmrFraudClientResponseException } from '../exceptions';

@Injectable()
export class CsmrFraudClientService {
  constructor(
    private readonly config: ConfigService,
    @Inject('FraudBroker') private readonly broker: ClientProxy,
  ) {}

  async processFraudCase(
    identity: Partial<IOidcIdentity>,
    fraudCase: FraudCaseDto,
  ): Promise<void> {
    const { requestTimeout } = this.config.get<RabbitmqConfig>('FraudBroker');

    try {
      const order = this.broker
        .send<'SUCCESS' | 'ERROR'>(FraudProtocol.Commands.PROCESS_FRAUD_CASE, {
          identity,
          fraudCase,
        })
        .pipe(timeout(requestTimeout));

      const result = await lastValueFrom<'SUCCESS' | 'ERROR'>(order);

      if (result === 'ERROR') {
        throw new Error('Received ERROR from consumer');
      }
    } catch (error) {
      throw new CsmrFraudClientResponseException(error);
    }
  }
}
