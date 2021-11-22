import { isEmpty } from 'lodash';
import { Adapter, AdapterConstructor } from 'oidc-provider';

import { Inject } from '@nestjs/common';

import { LoggerLevelNames, LoggerService } from '@fc/logger';
import { IServiceProviderAdapter } from '@fc/oidc';
import { Redis, REDIS_CONNECTION_TOKEN } from '@fc/redis';

import {
  OidcProviderParseRedisResponseException,
  OidcProviderStringifyPayloadForRedisException,
} from '../exceptions';
/** Circular reference for type checking */
import { OidcProviderService } from '../oidc-provider.service';

const consumable = new Set(['AuthorizationCode', 'RefreshToken', 'DeviceCode']);

/**
 * Prefix everything in redis.
 */
export const OIDC_PROVIDER_REDIS_PREFIX = 'OIDC-P';

/**
 * ⚠️  Warning ⚠️
 * This class is not using Nest DI!
 *
 * Because this class is instantiated by `oidc-provider`,
 * we provide a static method `getConstructorWithDI` which retrun
 * a bound version of the class.
 * @see OidcProviderService.getConfig()
 *
 * NB: `name` is passed by `oidc-provider` at instantiation time
 * and should remain the last argument.
 *
 * This class is the redis adapter for oidc-provider.
 * Its definition conforms to documentation provided by the author.
 * @see https://github.com/panva/node-oidc-provider/blob/master/example/my_adapter.js
 *
 * This version is roughly a copy/paste of redis example from the official repository
 * @see https://github.com/panva/node-oidc-provider/blob/master/example/adapters/redis.js
 */
export class OidcProviderRedisAdapter implements Adapter {
  constructor(
    /**
     * Bound arguments
     */
    private readonly logger: LoggerService,
    @Inject(REDIS_CONNECTION_TOKEN) private readonly redis: Redis,
    private readonly serviceProvider: IServiceProviderAdapter,
    /**
     * Instantiation time argument,
     * must remain the last one.
     */
    private readonly contextName: string,
  ) {
    this.contextName = contextName;
  }

  /**
   * Method to get a bounded class
   */
  static getConstructorWithDI(
    oidcProviderService: OidcProviderService,
    serviceProviderService: IServiceProviderAdapter,
  ): AdapterConstructor {
    /**
     * Bind services we want to inject from our regular NestJs service.
     *
     * NB: Thoses services are privates but we need them to keep NestJs context.
     */
    const boundConstructor = OidcProviderRedisAdapter.bind(
      null,
      oidcProviderService.logger,
      oidcProviderService.redis,
      serviceProviderService,
    );

    /**
     * `oidc-provider` makes checks to ensure that we pass a class,
     * rather than encapsulating the instantiation in a try/catch block,
     * prototype is analysed, so we have to provide something more fancy than a bounded function.
     *
     * @see https://github.com/panva/node-oidc-provider/blob/master/lib/helpers/initialize_adapter.js#L13
     * We have to forward prototype
     */
    boundConstructor.prototype = OidcProviderRedisAdapter.prototype;

    return boundConstructor;
  }

  private grantKeyFor(id: string): string {
    if (!id) {
      return null;
    }
    const key = `${OIDC_PROVIDER_REDIS_PREFIX}:grant:${id}`;
    return key;
  }

  private userCodeKeyFor(userCode: string): string {
    if (!userCode) {
      return null;
    }
    const key = `${OIDC_PROVIDER_REDIS_PREFIX}:userCode:${userCode}`;
    return key;
  }

  private uidKeyFor(uid: string): string {
    if (!uid) {
      return null;
    }
    const key = `${OIDC_PROVIDER_REDIS_PREFIX}:uid:${uid}`;
    return key;
  }

  private key(id: string): string {
    return `${OIDC_PROVIDER_REDIS_PREFIX}:${this.contextName}:${id}`;
  }

  private parsedPayload(payload) {
    try {
      return JSON.parse(payload);
    } catch (error) {
      throw new OidcProviderParseRedisResponseException();
    }
  }

  private saveKey(multi, key, data) {
    let dataFormated: string;

    try {
      dataFormated = JSON.stringify(data);
    } catch (error) {
      /**
       * Forced to throw using our helper, since `oidc-provider` catches
       * the exception.
       *
       * @see OidcProviderService.throwError()
       */
      throw new OidcProviderStringifyPayloadForRedisException();
    }

    const hasContext = consumable.has(this.contextName);
    const store = hasContext ? { payload: dataFormated } : dataFormated;

    const command = hasContext ? 'hmset' : 'set';
    (multi[command] as Function)(key, store);
  }

  private async saveGrantId(
    multi,
    grantId: string,
    key: string,
    expiresIn: number,
  ) {
    const grantKey = this.grantKeyFor(grantId);
    if (!grantKey) {
      return;
    }
    multi.rpush(grantKey, key);
    // if you're seeing grant key lists growing out of acceptable proportions consider using LTRIM
    // here to trim the list to an appropriate length
    const ttl = await this.redis.ttl(grantKey);
    if (expiresIn > ttl) {
      multi.expire(grantKey, expiresIn);
    }
  }

  private addSetAndExpireOnMulti(
    key: string,
    id: string,
    expiresIn: number,
    multi,
  ): void {
    if (key) {
      multi.set(key, id);
      multi.expire(key, expiresIn);
    }
  }

  async upsert(id: string, payload: any, expiresIn: number) {
    this.logger.debug('Upsert');

    const key = this.key(id);
    this.logger.trace({ upsert: { id, payload, expiresIn, key } });

    if (expiresIn && isNaN(expiresIn)) {
      throw new TypeError(
        `expiresIn MUST be a number, <${typeof expiresIn}> given.`,
      );
    }

    const multi = this.redis.multi();

    this.saveKey(multi, key, payload);

    if (expiresIn) {
      multi.expire(key, expiresIn);
    }

    const { grantId, userCode, uid } = payload;
    await this.saveGrantId(multi, grantId, key, expiresIn);

    const userCodeKey = this.userCodeKeyFor(userCode);
    const uidKey = this.uidKeyFor(uid);

    this.addSetAndExpireOnMulti(userCodeKey, id, expiresIn, multi);
    this.addSetAndExpireOnMulti(uidKey, id, expiresIn, multi);

    await multi.exec();
  }

  private async findServiceProvider(spId: string) {
    const sp = await this.serviceProvider.getById(spId);

    this.logger.trace({ spId, sp });
    return sp;
  }

  private async findInRedis(id: string) {
    const key = this.key(id);

    const command = consumable.has(this.contextName) ? 'hgetall' : 'get';
    const data = await this.redis[command](key);

    if (isEmpty(data)) {
      this.logger.trace({ find: { id, key, data } }, LoggerLevelNames.WARN);
      return void 0;
    }

    this.logger.trace({ find: { id, key, data } });

    const wrappedData = typeof data === 'string' ? { payload: data } : data;
    const { payload, ...rest } = wrappedData;

    const parsedPayload = this.parsedPayload(payload);

    return {
      ...rest,
      ...parsedPayload,
    };
  }

  async find(id: string) {
    this.logger.debug('Find');

    if (this.contextName === 'Client') {
      return await this.findServiceProvider(id);
    }

    return await this.findInRedis(id);
  }

  async findByUid(uid: string) {
    const id = await this.redis.get(this.uidKeyFor(uid));
    return this.find(id);
  }

  async findByUserCode(userCode: string) {
    const id = await this.redis.get(this.userCodeKeyFor(userCode));
    return this.find(id);
  }

  async destroy(id: string) {
    this.logger.debug('Destroy');
    this.logger.trace({ destroy: { id, key: this.key(id) } });

    const key = this.key(id);
    await this.redis.del(key);
  }

  async revokeByGrantId(grantId: string) {
    this.logger.debug('RevokeByGrantId');
    this.logger.trace({
      revoke: {
        grantId,
        grantKey: this.grantKeyFor(grantId),
      },
    });

    const multi = this.redis.multi();
    const tokens = await this.redis.lrange(this.grantKeyFor(grantId), 0, -1);
    tokens.forEach((token: string) => multi.del(token));
    multi.del(this.grantKeyFor(grantId));

    await multi.exec();
  }

  async consume(id: string) {
    this.logger.debug('Consume');
    this.logger.trace({ consume: { id, key: this.key(id) } });

    await this.redis.hset(
      this.key(id),
      'consumed',
      Math.floor(Date.now() / 1000),
    );
  }
}
