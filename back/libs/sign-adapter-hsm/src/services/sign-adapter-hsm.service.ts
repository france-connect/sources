import { KeyLike } from 'crypto';

import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { DigestsForAlg } from '@fc/cryptography';
import { CsmrHsmClientService } from '@fc/csmr-hsm-client';
import { MicroservicesRmqConfig } from '@fc/microservices-rmq';
import { SignAdapterServiceInterface } from '@fc/sign-adapter';

@Injectable()
export class SignAdapterHsmService implements SignAdapterServiceInterface {
  constructor(
    private readonly config: ConfigService,
    @Inject('CsmrHsmClient')
    private readonly csmrHsmClient: CsmrHsmClientService,
  ) {}

  async sign(
    data: string,
    alg: string,
    _key?: Uint8Array | KeyLike,
  ): Promise<Uint8Array> {
    const { payloadEncoding } = this.config.get<MicroservicesRmqConfig>(
      'CsmrHsmClientMicroService',
    );
    const signature = await this.csmrHsmClient.sign(
      data,
      alg as keyof DigestsForAlg,
      payloadEncoding,
    );

    return signature;
  }
}
