import { KeyLike, sign } from 'crypto';

import { Injectable } from '@nestjs/common';

import { DigestsForAlg } from '@fc/cryptography';
import { SignAdapterServiceInterface } from '@fc/sign-adapter';

@Injectable()
export class SignAdapterNativeService implements SignAdapterServiceInterface {
  async sign(data: string, alg: string, key?: KeyLike): Promise<Uint8Array> {
    const signature = await Promise.resolve(
      sign(DigestsForAlg[alg], Buffer.from(data), key),
    );

    return signature;
  }
}
