import * as IgniteClient from 'apache-ignite-client';
import { operation, OperationOptions, RetryOperation } from 'retry';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { ApacheIgniteConfig } from './dto';
import { ApacheIgniteInvalidSocketException } from './exceptions';

const { ObjectType, IgniteClientConfiguration, STATE } = IgniteClient;

@Injectable()
export class ApacheIgniteService {
  private igniteClient: IgniteClient;
  private static IgniteClientProxy = IgniteClient;
  private static IgniteClientConfigurationProxy = IgniteClientConfiguration;
  private retryOperation: RetryOperation;

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

  onModuleInit(): void {
    this.logger.debug('onModuleInit');

    this.retryApacheIgnite(this.triggerIgnite.bind(this));
  }

  /**
   * Disconnect the apache ignite cache instance
   * @returns A promise that resolves when the cache is disconnected
   */
  onModuleDestroy(): unknown {
    this.clearRetryApacheIgnite();
    return this.igniteClient.disconnect();
  }

  /**
   * Connect to the apache ignite server defined in the configuration and the
   * client initialized by the constructor
   */
  async connectIgnite(): Promise<void> {
    const { endpoint, socketKeepAlive, tls, auth } =
      this.config.get<ApacheIgniteConfig>('ApacheIgnite');
    const { key, cert, ca, useTls } = tls;

    this.logger.debug('Connecting to apache-ignite cache...');
    /* 
    Partition awareness allows the thin client to send query 
    requests directly to the node that owns the queried data.
    Without partition awareness, an application that is connected to the cluster via
    a thin client executes all queries and operations via a single server node that acts 
    as a proxy for the incoming requests. 
    These operations are then re-routed to the node that stores the data that is being requested.
    This results in a bottleneck that could prevent the application from scaling linearly.
    @see https://ignite.apache.org/docs/latest/thin-clients/java-thin-client#partition-awareness
    */
    const partitionAwareness = true;
    const connectionOptions = { key, cert, ca };

    await this.igniteClient.connect(
      new ApacheIgniteService.IgniteClientConfigurationProxy(endpoint)
        .setUserName(auth.username)
        .setPassword(auth.password)
        .setConnectionOptions(useTls, connectionOptions, partitionAwareness),
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

  async triggerIgnite(attempt): Promise<void> {
    this.logger.debug(`Apache Ignite client, Connection attempt: ${attempt}`);
    try {
      await this.connectIgnite();
    } catch (err) {
      this.logger.error(err);
    }
  }

  private retryApacheIgnite(fn: () => void, err?: Error): void {
    if (!this.retryOperation) {
      this.logger.debug(
        'Apache ignite client failed to connect, create retry process',
      );

      const { maxRetryTimeout } =
        this.config.get<ApacheIgniteConfig>('ApacheIgnite');
      const options: OperationOptions = {
        forever: true,
        maxTimeout: maxRetryTimeout,
      };

      this.retryOperation = operation(options);
      this.retryOperation.attempt(fn);
    } else {
      this.logger.debug(
        'Apache ignite client failed to connect, retry new attempt...',
      );
      // an Error is required to work!
      this.retryOperation.retry(err);
    }
  }

  private clearRetryApacheIgnite() {
    if (this.retryOperation) {
      this.retryOperation.stop();
      this.retryOperation = null;
    }
  }

  /**
   * A function to handle any connection or disconnection event from the
   * apache ignite client
   * @param state A state as defined by IgniteClient.STATE
   * @param reason the reason why the disconnect event was fired
   */

  // eslint-disable-next-line complexity
  private onStateChanged(state: number, reason?: string | Error): void {
    // STATE.CONNECTING is mandatory ignored
    if (state === STATE.CONNECTED) {
      this.logger.debug('Apache ignite client is connected');
      this.clearRetryApacheIgnite();
    } else if (state === STATE.DISCONNECTED) {
      const error = reason instanceof Error ? reason : new Error(reason);
      this.retryApacheIgnite(this.triggerIgnite.bind(this), error);
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
