import { ClassTransformOptions } from 'class-transformer';

import { Injectable } from '@nestjs/common';

import { AsyncLocalStorageService } from '@fc/async-local-storage';
import { getTransformed, validateDto } from '@fc/common';
import { ConfigService, validationOptions } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { RedisService } from '@fc/redis';

import { SessionConfig } from '../dto';
import {
  SessionBadAliasException,
  SessionBadFormatException,
  SessionBadStringifyException,
  SessionNoSessionIdException,
  SessionStorageException,
} from '../exceptions';
import {
  ISessionBoundContext,
  ISessionRequest,
  ISessionResponse,
  ISessionService,
  SessionStoreContentInterface,
  SessionStoreInterface,
} from '../interfaces';
import { SESSION_STORE_KEY } from '../tokens';
import { SessionTemplateService } from './session-template.service';

export type RedisQueryResult = [Error | null, any];

export const DUPLICATE_OPTIONS: ClassTransformOptions = {
  excludeExtraneousValues: true,
};

@Injectable()
export class SessionService {
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
    private readonly cryptography: CryptographyService,
    private readonly sessionTemplate: SessionTemplateService,
    private readonly asyncLocalStorage: AsyncLocalStorageService<SessionStoreInterface>,
  ) {}

  static getBoundSession<T = unknown>(
    req: ISessionRequest,
    moduleName: string,
  ): ISessionService<T> {
    const { sessionId, sessionService } = req;

    if (!sessionId) {
      throw new SessionNoSessionIdException();
    }

    const boundSessionContext: ISessionBoundContext = {
      sessionId,
      moduleName,
    };

    /**
     * The binding occurs to force the "set" and "get" operations within the
     * current module (set by the decorator used in a controller)
     */
    return {
      get: sessionService.get.bind(sessionService, boundSessionContext),
      set: sessionService.set.bind(sessionService, boundSessionContext),
      setAlias: sessionService.setAlias.bind(
        sessionService,
        boundSessionContext,
      ),
      commit: sessionService.commit.bind(sessionService, boundSessionContext),
    };
  }

  private async getSessionFromStore(
    ctx: ISessionBoundContext,
  ): Promise<SessionStoreContentInterface> {
    const { sessionId } = ctx;

    const session = this.asyncLocalStorage.get(SESSION_STORE_KEY);

    if (!session) {
      return { data: {}, sync: false, id: null };
    }

    if (!session.data || session.id !== sessionId) {
      const data = await this.getFullSession(sessionId);
      session.data = data;
      session.id = sessionId;
      session.sync = true;
    }

    return session;
  }

  /**
   * Retrieves a module session or a part of it
   *
   * @param ctx The context bound by the interceptor
   * @param key The key of the sub data to retrieve
   * @return The module session or a part of it
   */
  async get(
    ctx: ISessionBoundContext,
    key?: string,
  ): Promise<unknown | undefined> {
    const session = await this.getSessionFromStore(ctx);

    if (key) {
      return this.getByKey(ctx, session.data, key);
    }

    return this.getModule(ctx, session.data);
  }

  /**
   * Patch a module session or a part of it
   *
   * @param ctx The context bound by the interceptor
   * @param keyOrData The module data if it's a patch, else the key
   * @param data The data to set in session if the key is provided
   * @return The "save" operation result as a boolean
   */
  async set(
    ctx: ISessionBoundContext,
    keyOrData: string | object,
    data?: unknown,
  ): Promise<void> {
    const session = await this.getSessionFromStore(ctx);

    if (typeof keyOrData === 'string') {
      this.setByKey(ctx, session.data, keyOrData, data);
    } else if (typeof keyOrData === 'object') {
      this.setModule(ctx, session.data, keyOrData);
    }

    session.sync = false;
  }

  public async commit(ctx: ISessionBoundContext): Promise<boolean> {
    const session = await this.getSessionFromStore(ctx);

    if (!session.sync) {
      const status = await this.save(ctx.sessionId, session.data);
      session.sync = status;

      return status;
    }

    return true;
  }

  /**
   * Refresh the TTL of the session in redis
   *
   * @param ctx The context bound by the interceptor to the "set" or "get" operation
   * @return The "expire" operation result as a boolean
   */
  async refresh(req: ISessionRequest, res: ISessionResponse): Promise<string> {
    const { lifetime } = this.config.get<SessionConfig>('Session');

    const sessionId: string = this.getSessionIdFromCookie(req);

    const sessionKey: string = this.getSessionKey(sessionId);
    await this.redis.client.expire(sessionKey, lifetime);

    this.setCookies(res, sessionId);

    this.bindToRequest(req, sessionId);

    return sessionId;
  }

  /**
   * Retrieves the entire session in redis and validate it using the DTO
   *
   * provided at the initialization
   * @param ctx The context bound by the interceptor
   * @return The full session
   */
  private async getFullSession(sessionId: string): Promise<object> {
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
      return {};
    }

    const data = this.unserialize(dataCipher);
    await this.validate(data);

    return data;
  }

  /**
   * Get a value in the session module corresponding to the provided key
   *
   * @param ctx The context bound by the interceptor
   * @param session The full session
   * @param key The key to retrieve in the ctx module session
   * @return The part of the session module corresponding to the provided key
   */
  private getByKey(
    ctx: ISessionBoundContext,
    session: object,
    key: string,
  ): unknown | undefined {
    return session[ctx.moduleName]?.[key];
  }

  /**
   * Get the session module
   *
   * @param ctx The context bound by the interceptor
   * @param session The full session
   * @return The session module
   */
  private getModule(
    ctx: ISessionBoundContext,
    session: object,
  ): unknown | undefined {
    return session[ctx.moduleName];
  }

  /**
   * Set a value in the session module corresponding to the provided key
   *
   * @param ctx The context bound by the interceptor
   * @param session The full session
   * @param key The key to set in the ctx module session
   * @param data The data to set in the ctx module session
   */
  private setByKey(
    ctx: ISessionBoundContext,
    session: object,
    key: string,
    data: unknown,
  ): void {
    if (session[ctx.moduleName]) {
      session[ctx.moduleName][key] = data;
    } else {
      session[ctx.moduleName] = {
        [key]: data,
      };
    }
  }

  /**
   * Patch the session module with the provided data
   *
   * @param ctx The context bound by the interceptor
   * @param session The full session
   * @param data The data to patch in the ctx module session
   */
  private setModule(
    ctx: ISessionBoundContext,
    session: object,
    data: object,
  ): void {
    session[ctx.moduleName] = {
      ...session[ctx.moduleName],
      ...data,
    };
  }

  /**
   * Serialize, encrypt, expire and save the data to redis
   *
   * @param sessionId The id of the session to save
   * @param data The full session to save
   * @return The boolean result of the multi operation in redis
   */
  private async save(sessionId: string, data: object): Promise<boolean> {
    const { lifetime } = this.config.get<SessionConfig>('Session');
    const key = this.getSessionKey(sessionId);

    const serialized = this.serialize(data);

    const multi = this.redis.client.multi();

    multi.set(key, serialized);
    multi.expire(key, lifetime);

    const status = await multi.exec();

    return Boolean(status);
  }

  init(req: ISessionRequest, res: ISessionResponse): string {
    const { sessionIdLength } = this.config.get<SessionConfig>('Session');
    const sessionId: string =
      this.cryptography.genRandomString(sessionIdLength);

    this.setCookies(res, sessionId);
    this.bindToRequest(req, sessionId);

    return sessionId;
  }

  async reset(req: ISessionRequest, res: ISessionResponse): Promise<string> {
    const { sessionId } = req;
    const sessionKey = this.getSessionKey(sessionId);

    res.locals.session = {};

    await this.redis.client.del(sessionKey);

    this.asyncLocalStorage.set(SESSION_STORE_KEY, {
      data: {},
      id: sessionId,
      sync: true,
    });

    return this.init(req, res);
  }

  async destroy(req: ISessionRequest, res: ISessionResponse) {
    const { sessionId } = req;
    const sessionKey = this.getSessionKey(sessionId);

    res.locals.session = {};
    this.clearCookie(res);

    return await this.redis.client.del(sessionKey);
  }

  async duplicate(req: ISessionRequest, res: ISessionResponse, schema) {
    const { sessionId } = req;

    const context = {
      sessionId,
      moduleName: null,
    };

    // Commit any pending changes
    await this.commit(context);

    // Fetch current session data
    const { data: currentData } = await this.getSessionFromStore(context);

    // Keep only data in schema
    const cleanData = getTransformed(currentData, schema, DUPLICATE_OPTIONS);

    // // Init new session
    const newSessionId = this.init(req, res);

    this.asyncLocalStorage.set(SESSION_STORE_KEY, {
      data: cleanData,
      id: newSessionId,
      sync: false,
    });

    // Bind the session to Response
    res.locals.session = cleanData;

    return cleanData;
  }

  async detach(
    req: ISessionRequest,
    res: ISessionResponse,
    backendLifetime?: number,
  ): Promise<void> {
    // Reset value bound to Response
    res.locals.session = {};

    const context = {
      sessionId: req.sessionId,
      moduleName: null,
    };

    await this.set(context, {});

    /**
     * Expire value stored in redis
     * @info this code is not currently used
     * @todo #1512 Handle backend session data expiration
     */
    if (backendLifetime) {
      const sessionKey = this.getSessionKey(req.sessionId);
      await this.redis.client.expire(sessionKey, backendLifetime);
    }

    // Reset sessionId stored in browser
    this.clearCookie(res);
  }

  async attach(req: ISessionRequest, res: ISessionResponse, sessionId: string) {
    this.bindToRequest(req, sessionId);
    this.setCookies(res, sessionId);
    await this.sessionTemplate.bindSessionToRes(req, res);
  }

  private clearCookie(res: ISessionResponse) {
    const { cookieOptions, sessionCookieName } =
      this.config.get<SessionConfig>('Session');

    const removeCookieOptions = {
      ...cookieOptions,
      maxAge: -9,
      signed: false, // Pas indispensable mais permet d'éviter d'envoyer la signature d'une chaîne vide.
    };

    res.clearCookie(sessionCookieName, removeCookieOptions);
  }

  getSessionIdFromCookie(req: ISessionRequest): string | undefined {
    const { sessionCookieName } = this.config.get<SessionConfig>('Session');

    return req.signedCookies[sessionCookieName];
  }

  /**
   * Attach the current `sessionId` to the current request.
   * @param {ISessionRequest} req
   * @param {string} sessionId
   */
  bindToRequest(req: ISessionRequest, sessionId: string): void {
    req.sessionService = this;
    req.sessionId = sessionId;
  }

  private setCookies(res: ISessionResponse, sessionId: string): void {
    const { cookieOptions, sessionCookieName } =
      this.config.get<SessionConfig>('Session');

    res.cookie(sessionCookieName, sessionId, cookieOptions);
    /**
     * To debug a Panva misestimating of cookie
     * @see ./node_modules/oidc-provider/lib/shared/session.js:47
     * ```js
     *   ctx.response.get('set-cookie').forEach((cookie, index, array) => {...});
     * ```
     * Where the getter expect to have an array of cookies.
     * To fix this bug we have to provide at least two cookies to prevent Oidc to crash.
     */
    res.cookie(
      'duplicate-cookie-name',
      'duplicate-cookie-value',
      cookieOptions,
    );
  }

  /**
   * Transform data to encrypted string, easy to persist.
   *
   * @param data data to serialize
   * @returns encrypted string representation of <data>
   */
  private serialize(data: object): string {
    const { encryptionKey } = this.config.get<SessionConfig>('Session');
    /**
     * @todo #415 should probably have a try/catch with custom error code
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/415
     */

    let dataString;
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
  private unserialize(data: string): object | never {
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

  /**
   *
   * @todo #485 Fix validation process
   *   author: Hugues
   *   date: 2021/04/15
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/485
   */
  private async validate(session: object): Promise<void> {
    /**
     * @todo #416 Add specific error code
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/416
     */
    const { schema } = this.config.get<SessionConfig>('Session');

    await validateDto(session, schema, validationOptions);
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

  /**
   * This method is used to save the corresponding reference
   * from OIDC's `interactionId` and our `sessionId`
   *
   * @param {string} key Use to interactionId
   * @param {string} value sessionId
   * @param {number} lifetime in milisec
   * @returns {RedisQueryResult[]>}
   */
  async setAlias(
    ctx: ISessionBoundContext,
    key: string,
  ): Promise<RedisQueryResult[]> {
    const { lifetime } = this.config.get<SessionConfig>('Session');
    const multi = this.redis.client.multi();

    multi.set(key, ctx.sessionId);
    multi.expire(key, lifetime);

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
    const multi = this.redis.client.multi();

    multi.get(key);

    const results: RedisQueryResult[] = await multi.exec();
    const value: string = results[0][1];
    return value;
  }
}
