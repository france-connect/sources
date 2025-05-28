import { Inject, Injectable } from '@nestjs/common';

import { FunctionSafe } from '@fc/common';
import { ConfigService } from '@fc/config';
import { ActionTypes, CsmrHsmClientService } from '@fc/csmr-hsm-client';
import { throwException } from '@fc/exceptions';
import { SignatureDigest } from '@fc/hsm';
import { LoggerService } from '@fc/logger';
import { MicroservicesRmqConfig } from '@fc/microservices-rmq';
import { OverrideCode } from '@fc/override-code';

import { CryptographyInvalidPayloadFormatException } from '../exceptions';

@Injectable()
export class CryptoOverrideService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    @Inject('CsmrHsmClient')
    private readonly hsm: CsmrHsmClientService,
  ) {}

  onModuleInit() {
    /**
     * Override dependecies
     * Function has to be wrapped at init time,
     * @see ../overrides
     * @see your main.ts file
     */
    this.registerOverride('crypto.sign');
  }

  private registerOverride(name) {
    this.logger.notice(`Registering function override for "${name}".`);
    OverrideCode.override(name, this[name].bind(this));
  }

  /**
   * Use our own sign library
   */
  private ['crypto.sign'](
    nodeAlg: SignatureDigest,
    payload: Uint8Array,
    _key: unknown,
    callback: FunctionSafe,
  ) {
    if (!(payload instanceof Uint8Array)) {
      throw new CryptographyInvalidPayloadFormatException();
    }

    /**
     * Return a wrapper compatible with usage mae by `JOSE`:
     * Jose internally makes call to native crypto createSign
     * `createSign(nodeAlg).update(payload).sign(key)`
     */
    return this.sign(Buffer.from(payload), nodeAlg, callback);
  }

  /**
   * Sign data using crypto and a private key
   * we do not use it since signature will occur with an HSM stored key.
   */
  sign(
    dataBuffer: Buffer,
    digest = SignatureDigest.SHA256,
    callback: FunctionSafe,
  ): void {
    const { payloadEncoding } = this.config.get<MicroservicesRmqConfig>(
      'CsmrHsmClientMicroService',
    );

    const message = {
      type: ActionTypes.SIGN,
      payload: {
        data: dataBuffer.toString(payloadEncoding),
        digest,
      },
    };

    this.hsm
      .publish(message)
      .then(({ payload }) => {
        callback(null, Buffer.from(payload, payloadEncoding));
      })
      .catch(async (err) => {
        await throwException(err);
      });
  }
}
