import { isEmpty } from 'lodash';
import { Adapter, AdapterConstructor } from 'oidc-provider';

import { IServiceProviderAdapter } from '@fc/oidc';
import { RedisService } from '@fc/redis';

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
    private readonly redis: RedisService,
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
   * Method to get a bound class
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
      oidcProviderService.redis,
      serviceProviderService,
    );

    /**
     * `oidc-provider` makes checks to ensure that we pass a class,
     * rather than encapsulating the instantiation in a try/catch block,
     * prototype is analysed, so we have to provide something more fancy than a bound function.
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
    const ttl = await this.redis.client.ttl(grantKey);
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
    const key = this.key(id);

    if (expiresIn && isNaN(expiresIn)) {
      throw new TypeError(
        `expiresIn MUST be a number, <${typeof expiresIn}> given.`,
      );
    }

    const multi = this.redis.client.multi();

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

    return sp;
  }

  private async findInRedis(id: string) {
    const key = this.key(id);

    const command = consumable.has(this.contextName) ? 'hgetall' : 'get';
    const data = await this.redis.client[command](key);

    if (isEmpty(data)) {
      return void 0;
    }

    const wrappedData = typeof data === 'string' ? { payload: data } : data;
    const { payload, ...rest } = wrappedData;

    const parsedPayload = this.parsedPayload(payload);

    return {
      ...rest,
      ...parsedPayload,
    };
  }

  async find(id: string) {
    if (this.contextName === 'Client') {
      return await this.findServiceProvider(id);
    }

    return await this.findInRedis(id);
  }

  async findByUid(uid: string) {
    const id = await this.redis.client.get(this.uidKeyFor(uid));
    return this.find(id);
  }

  async findByUserCode(userCode: string) {
    const id = await this.redis.client.get(this.userCodeKeyFor(userCode));
    return this.find(id);
  }

  async destroy(id: string) {
    const key = this.key(id);
    await this.redis.client.del(key);
  }

  async revokeByGrantId(grantId: string) {
    const multi = this.redis.client.multi();
    const tokens = await this.redis.client.lrange(
      this.grantKeyFor(grantId),
      0,
      -1,
    );
    tokens.forEach((token: string) => multi.del(token));
    multi.del(this.grantKeyFor(grantId));

    await multi.exec();
  }

  async consume(id: string) {
    await this.redis.client.hset(
      this.key(id),
      'consumed',
      Math.floor(Date.now() / 1000),
    );
  }

  async getExpireAndPayload<T>(
    id: string,
  ): Promise<{ expire: number; payload: T }> {
    const key = this.key(id);

    const { ttl, value } = await this.fetchTtlAndValue(key);

    if (ttl <= 0) {
      return {
        expire: -1,
        payload: null,
      };
    }

    const payload = this.parsedPayload(value);

    /**
     * Using floor to avoid amplifying rounding TTL errors between the time we get the TTL
     * and the time we use it to generate the JWT.
     */
    const now = Math.floor(Date.now() / 1000);
    const expire = now + ttl;

    return {
      expire,
      payload,
    };
  }

  private async fetchTtlAndValue(
    key: string,
  ): Promise<{ ttl: number; value: string }> {
    const result = await this.redis.client.multi().ttl(key).get(key).exec();

    const [[, ttl], [, value]] = result;

    if (typeof ttl !== 'number' || typeof value !== 'string') {
      return { ttl: -1, value: null };
    }

    return { ttl, value };
  }
}
