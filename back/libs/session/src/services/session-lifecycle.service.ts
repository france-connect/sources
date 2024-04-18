import { ClassTransformOptions } from 'class-transformer';
import { Request, Response } from 'express';
import { cloneDeep } from 'lodash';

import { Injectable, Type } from '@nestjs/common';

import { getTransformed } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';

import { SessionConfig } from '../dto';
import { SessionCannotCommitUndefinedSession } from '../exceptions';
import { SessionBackendStorageService } from './session-backend-storage.service';
import { SessionCookiesService } from './session-cookies.service';
import { SessionLocalStorageService } from './session-local-storage.service';

export const DUPLICATE_OPTIONS: ClassTransformOptions = {
  excludeExtraneousValues: true,
};

@Injectable()
export class SessionLifecycleService {
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    private readonly config: ConfigService,
    private readonly cryptography: CryptographyService,
    private readonly localStorage: SessionLocalStorageService,
    private readonly backendStorage: SessionBackendStorageService,
    private readonly cookies: SessionCookiesService,
  ) {}

  init(res: Response): string {
    const { sessionIdLength, defaultData } =
      this.config.get<SessionConfig>('Session');
    const sessionId: string =
      this.cryptography.genRandomString(sessionIdLength);

    this.localStorage.setStore({
      data: cloneDeep(defaultData),
      id: sessionId,
      sync: false,
    });

    this.cookies.set(res, sessionId);

    return sessionId;
  }

  async initCache(sessionId: string): Promise<void> {
    const store = this.localStorage.getStore();

    if (store.id === sessionId && store.sync) {
      return;
    }

    const data = await this.backendStorage.get(sessionId);

    this.localStorage.setStore({
      data,
      id: sessionId,
      sync: true,
    });
  }

  async reset(res: Response): Promise<string> {
    const { id } = this.localStorage.getStore();

    await this.backendStorage.remove(id);

    return this.init(res);
  }

  async duplicate(res: Response, schema: Type<unknown>) {
    // Commit any pending changes
    await this.commit();

    // Fetch current session data
    const { data: currentData } = this.localStorage.getStore();

    // Keep only data in schema
    const cleanData = getTransformed(currentData, schema, DUPLICATE_OPTIONS);

    // Init new session
    const newSessionId = this.init(res);

    this.localStorage.setStore({
      data: cleanData,
      id: newSessionId,
      sync: false,
    });

    return cleanData;
  }

  async refresh(req: Request, res: Response): Promise<string> {
    const { lifetime } = this.config.get<SessionConfig>('Session');

    const sessionId = this.cookies.get(req);

    await this.backendStorage.expire(sessionId, lifetime);

    this.cookies.set(res, sessionId);

    return sessionId;
  }

  async destroy(res: Response) {
    const { id } = this.localStorage.getStore();

    this.cookies.remove(res);

    return await this.backendStorage.remove(id);
  }

  async detach(res: Response, backendLifetime?: number): Promise<void> {
    const { id } = this.localStorage.getStore();
    const { defaultData } = this.config.get<SessionConfig>('Session');
    this.localStorage.setStore({
      data: cloneDeep(defaultData),
      id: undefined,
      sync: false,
    });

    /**
     * Expire value stored in redis
     * @info this code is not currently used
     * @todo #1512 Handle backend session data expiration
     */
    if (backendLifetime) {
      await this.backendStorage.expire(id, backendLifetime);
    }

    this.cookies.remove(res);
  }

  async commit(): Promise<boolean> {
    const { data, id, sync } = this.localStorage.getStore();

    if (!id) {
      throw new SessionCannotCommitUndefinedSession();
    }

    if (!sync) {
      const status = await this.backendStorage.save(id, data);

      this.localStorage.setStore({
        data,
        id,
        sync: status,
      });

      return status;
    }

    return true;
  }
}
