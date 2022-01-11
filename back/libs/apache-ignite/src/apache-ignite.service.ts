import * as IgniteClient from 'apache-ignite-client';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { ApacheIgniteConfig } from './dto';
import { ApacheIgniteInvalidSocketException } from './exceptions';

const { ObjectType, IgniteClientConfiguration, STATE } = IgniteClient;

@Injectable()
export class ApacheIgniteService {
  private igniteClient: IgniteClient;
  private static IgniteClientProxy = IgniteClient;
  private static IgniteClientConfigurationProxy = IgniteClientConfiguration;

  /**
   * Instantiate an apache ignite client and bind a callback to call when the
   * state change
   */
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name);

    this.igniteClient = new ApacheIgniteService.IgniteClientProxy(
      this.onStateChanged.bind(this),
    );
  }

  /**
   * Connect to the apache ignite server defined in the configuration and the
   * client initialized by the constructor
   */
  async onModuleInit(): Promise<void> {
    const { endpoint, socketKeepAlive } =
      this.config.get<ApacheIgniteConfig>('ApacheIgnite');

    this.logger.debug('Connecting to apache-ignite cache...');

    await this.igniteClient.connect(
      new ApacheIgniteService.IgniteClientConfigurationProxy(endpoint),
    );

    this.logger.debug(
      `[setSocketKeepAlive]: enable = ${socketKeepAlive.enable} ; initialDelay = ${socketKeepAlive.initialDelay}`,
    );

    this.setSocketKeepAlive(
      socketKeepAlive.enable,
      socketKeepAlive.initialDelay,
    );
  }

  /**
   * Disconnect the apache ignite cache instance
   * @returns A promise that resolves when the cache is disconnected
   */
  async onModuleDestroy(): Promise<unknown> {
    return this.igniteClient.disconnect();
  }

  /**
   * Retrieve a particular cache in the the apache ignite client
   * @param name The name of the cache to retrieve
   * @param keyType The type of the cache key (as one in the IgniteClient.ObjectType)
   * @param valueType The type of the cache value (as one in the IgniteClient.ObjectType)
   * @returns A cache instance with methods to read or write data
   */
  getCache(
    name: string,
    keyType: number = ObjectType.PRIMITIVE_TYPE.STRING,
    valueType: number = ObjectType.PRIMITIVE_TYPE.STRING,
  ) {
    return this.igniteClient
      .getCache(name)
      .setKeyType(keyType)
      .setValueType(valueType);
  }

  /**
   * A function to handle any connection or disconnection event from the
   * apache ignite client
   * @param state A state as defined by IgniteClient.STATE
   * @param reason the reason why the disconnect event was fired
   */
  private onStateChanged(state: number, reason?: unknown): void {
    if (state === STATE.CONNECTED) {
      this.logger.debug('Apache ignite client is connected');
    } else if (state === STATE.DISCONNECTED) {
      /**
       * @todo #304 Here we may need to try to reconnect or throw
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/304
       */
      this.logger.debug('Apache ignite client disconnected');
      if (reason) {
        this.logger.debug(reason);
      }
    }
  }

  /**
   * This is used to prevent the disconnection of the ignite client socket in production.
   * @param enable Enable or disable
   * @param initialDelay Delay in Ms
   */
  private setSocketKeepAlive(enable: boolean, initialDelay: number): void {
    if (!this.igniteClient._socket) {
      throw new ApacheIgniteInvalidSocketException();
    }

    // We need to access the low level NodeJs socket instance
    this.igniteClient._socket._socket._socket.setKeepAlive(
      enable,
      initialDelay,
    );
  }
}
