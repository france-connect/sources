import { Injectable } from '@nestjs/common';

import { validateDto } from '@fc/common';
import { ConfigService, validationOptions } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { LoggerService } from '@fc/logger';
import { RedisService } from '@fc/redis';

import { SessionConfig } from '../dto';
import {
  SessionBadAliasException,
  SessionBadFormatException,
  SessionBadStringifyException,
  SessionNotFoundException,
  SessionStorageException,
} from '../exceptions';
import { RedisQueryResult } from './session.service';

@Injectable()
export class SessionBackendStorageService {
  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
    private readonly cryptography: CryptographyService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Retrieves the entire session in redis and validate it using the DTO
   *
   * provided at the initialization
   * @param ctx The context bound by the interceptor
   * @return The full session
   */
  async get<T>(sessionId: string): Promise<T | never> {
    const sessionKey = this.getSessionKey(sessionId);

    let dataCipher: string;
    try {
      dataCipher = await this.redis.client.get(sessionKey);
    } catch (error) {
      throw new SessionStorageException();
    }

    /**
     * If the cipher is invalid, we set an empty session.
     */
    if (!dataCipher) {
      throw new SessionNotFoundException('backend.get');
    }

    const data = this.deserialize(dataCipher);
    await this.validate(data);

    return data as T;
  }

  async remove(sessionId: string): Promise<number> {
    const key = this.getSessionKey(sessionId);

    return await this.redis.client.del(key);
  }

  async expire(sessionId: string, ttl: number): Promise<number> {
    const key = this.getSessionKey(sessionId);

    return await this.redis.client.expire(key, ttl);
  }

  /**
   * Serialize, encrypt, expire and save the data to redis
   */
  async save(
    sessionId: string,
    data: Record<string, unknown>,
  ): Promise<boolean> {
    const { lifetime } = this.config.get<SessionConfig>('Session');
    const key = this.getSessionKey(sessionId);

    const serialized = this.serialize(data);

    const multi = this.redis.client.multi();

    multi.set(key, serialized);
    multi.expire(key, lifetime);

    /**
     * ioredis uses an old school asynchrone with callback convention,
     * the promise returns an array where the first element is the error or null on success.
     */
    const [error] = await multi.exec();

    return !error;
  }

  /**
   * Transform data to encrypted string, easy to persist.
   */
  private serialize(data: Record<string, unknown>): string | never {
    const { encryptionKey } = this.config.get<SessionConfig>('Session');
    /**
     * @todo #415 should probably have a try/catch with custom error code
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/415
     */

    let dataString: string;
    try {
      dataString = JSON.stringify(data);
    } catch (error) {
      throw new SessionBadStringifyException();
    }

    const dataCipher = this.cryptography.encryptSymetric(
      encryptionKey,
      dataString,
    );

    return dataCipher;
  }

  /**
   * Build back an object from encrypted string representation.
   *
   * @param data encrypted string representation of a data object
   * eg output of `serialize` method.
   * @returns object data
   */
  private deserialize(data: string): Record<string, unknown> | never {
    const session = this.config.get<SessionConfig>('Session');
    const { encryptionKey } = session;
    const dataString = this.cryptography.decryptSymetric(encryptionKey, data);

    try {
      return JSON.parse(dataString);
    } catch (error) {
      throw new SessionBadFormatException();
    }
  }

  /**
   * Validate the session using the DTO provided at the library initialization
   *
   * @param session The full session
   */
  private async validate(session: Record<string, unknown>): Promise<void> {
    /**
     * @todo #416 Add specific error code
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/416
     */
    const { schema } = this.config.get<SessionConfig>('Session');

    const errors = await validateDto(session, schema, validationOptions);

    if (errors.length > 0) {
      this.logger.crit(
        'SessionService:validate() Invalid session data from Redis',
      );

      /**
       * Temporary disable throw
       * For an iteration we watch logs and see if we have occurrences of invalid session data
       *
       * @todo #1575 Activate throw and remove logger
       *
       * throw new SessionInvalidSessionDataException();
       */
    }
  }

  /**
   * Contruct the session key using the context
   *
   * @param ctx The context bound by the interceptor
   * @return The session key
   */
  private getSessionKey(sessionId: string) {
    const { prefix } = this.config.get<SessionConfig>('Session');
    return `${prefix}::${sessionId}`;
  }

  async setAlias(
    alias: string,
    sessionId: string,
  ): Promise<RedisQueryResult[]> {
    const { lifetime } = this.config.get<SessionConfig>('Session');
    const multi = this.redis.client.multi();

    multi.set(alias, sessionId);
    multi.expire(alias, lifetime);

    const result: RedisQueryResult[] = await multi.exec();

    return result;
  }

  /**
   * Get our corresponding `sessionId` from Panva's `interactionId`
   *
   * @param {string} key interactionId
   * @returns {Promise<string>} return `sessionId`
   */
  async getAlias(key: string): Promise<string> {
    if (!key) {
      throw new SessionBadAliasException();
    }
    const value = await this.redis.client.get(key);

    return value;
  }
}
