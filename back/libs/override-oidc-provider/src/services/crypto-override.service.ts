import { timeout } from 'rxjs/operators';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { CryptoProtocol } from '@fc/microservices';
import { RabbitmqConfig } from '@fc/rabbitmq';

import {
  CryptographyGatewayException,
  CryptographyInvalidPayloadFormatException,
} from '../exceptions';
import { OverrideCode } from '../helpers';

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
  private ['crypto.sign'](nodeAlg: string, payload: Uint8Array, key: unknown) {
    if (!(payload instanceof Uint8Array)) {
      throw new CryptographyInvalidPayloadFormatException();
    }

    /**
     * Return a wrapper compatible with usage mae by `JOSE`:
     * Jose inernally makes call to native crypto createSign
     * `createSign(nodeAlg).update(payload).sign(key)`
     *
     * Version at time this code is written
     * @see https://github.com/panva/jose/tree/v1.25.0/lib/jwa/ecdsa.js#L28
     *
     * Current version
     * @see https://github.com/panva/jose/blob/master/lib/jwa/ecdsa.js#L28
     */
    return this.sign(key, Buffer.from(payload), nodeAlg);
  }

  /**
   * Sign data using crypto and a private key
   * @param {any} _unusedKey the private key provided by oidc-provider
   * we do not use it since signature will occur with an HSM stored key.
   * @param {Buffer} dataBuffer a serialized data
   * @param {string} digest default to sha256 (Cf. crypto.createSign)
   * @returns {Promise<Buffer>} Retuns a Promise with signed data or an error Exception.
   */
  // Actually returns a promise
  // eslint-disable-next-line require-await
  async sign(
    _unusedKey: any,
    dataBuffer: Buffer,
    digest = 'sha256',
  ): Promise<Buffer> {
    return new Promise((resolve: Function, reject: Function) => {
      const { payloadEncoding, requestTimeout } =
        this.config.get<RabbitmqConfig>('CryptographyBroker');

      try {
        // Build message
        const payload = {
          data: dataBuffer.toString(payloadEncoding),
          digest,
        };

        // Build callbacks
        const next = this.signSuccess.bind(this, resolve, reject);
        const error = (): void => {
          reject(new CryptographyGatewayException());
        };

        // Send message to gateway
        this.broker
          .send(CryptoProtocol.Commands.SIGN, payload)
          .pipe(timeout(requestTimeout))
          .subscribe({
            next,
            error,
          });
      } catch (error) {
        return reject(new CryptographyGatewayException());
      }
    });
  }

  // Handle successful call
  private signSuccess(resolve: Function, reject: Function, data: string): void {
    const { payloadEncoding } =
      this.config.get<RabbitmqConfig>('CryptographyBroker');
    /**
     * @TODO #146 define a more powerful mechanism
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/146
     */
    if (data === 'ERROR') {
      reject(new CryptographyGatewayException());
    }

    resolve(Buffer.from(data, payloadEncoding));
  }
}
