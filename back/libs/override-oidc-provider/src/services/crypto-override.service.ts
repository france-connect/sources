import { timeout } from 'rxjs/operators';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { FunctionSafe } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { CryptoProtocol } from '@fc/microservices';
import { OverrideCode } from '@fc/override-code';
import { RabbitmqConfig } from '@fc/rabbitmq';

import {
  CryptographyGatewayException,
  CryptographyInvalidPayloadFormatException,
} from '../exceptions';

@Injectable()
export class CryptoOverrideService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    @Inject('CryptographyBroker') private broker: ClientProxy,
  ) {}

  async onModuleInit() {
    /**
     * Override dependecies
     * Function has to be wrapped at init time,
     * @see ../overrides
     * @see your main.ts file
     */
    this.registerOverride('crypto.sign');
    await this.broker.connect();
  }

  onModuleDestroy() {
    this.broker.close();
  }

  private registerOverride(name) {
    this.logger.notice(`Registering function override for "${name}".`);
    OverrideCode.override(name, this[name].bind(this));
  }

  /**
   * Use our own sign library
   */
  private ['crypto.sign'](
    nodeAlg: string,
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
  sign(dataBuffer: Buffer, digest = 'sha256', callback: FunctionSafe): void {
    const { payloadEncoding, requestTimeout } =
      this.config.get<RabbitmqConfig>('CryptographyBroker');

    try {
      // Build message
      const payload = {
        data: dataBuffer.toString(payloadEncoding),
        digest,
      };

      // Build callbacks
      const next = this.signSuccess.bind(this, callback);
      const error = (): void => {
        callback(new CryptographyGatewayException(), null);
      };

      // Send message to gateway
      this.broker
        .send(CryptoProtocol.Commands.SIGN, payload)
        .pipe(timeout(requestTimeout))
        .subscribe({
          next,
          error,
        });
      // You can't remove the catch argument, it's mandatory
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return callback(new CryptographyGatewayException(), null);
    }
  }

  // Handle successful call
  private signSuccess(callback: FunctionSafe, data: string): void {
    const { payloadEncoding } =
      this.config.get<RabbitmqConfig>('CryptographyBroker');
    /**
     * @TODO #146 define a more powerful mechanism
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/146
     */

    if (data === 'ERROR') {
      return callback(new CryptographyGatewayException(), null);
    }

    callback(null, Buffer.from(data, payloadEncoding));
  }
}
