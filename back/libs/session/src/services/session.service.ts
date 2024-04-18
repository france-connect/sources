import { Request, Response } from 'express';

import { Injectable, Type } from '@nestjs/common';

import { SessionBackendStorageService } from './session-backend-storage.service';
import { SessionCookiesService } from './session-cookies.service';
import { SessionLifecycleService } from './session-lifecycle.service';
import { SessionLocalStorageService } from './session-local-storage.service';

export type RedisQueryResult = [Error | null, any];

@Injectable()
export class SessionService {
  constructor(
    private readonly localStorage: SessionLocalStorageService,
    private readonly backendStorage: SessionBackendStorageService,
    private readonly lifecycle: SessionLifecycleService,
    private readonly cookies: SessionCookiesService,
  ) {}

  /**
   * LocalStorage methods
   *
   * Usual methods to get and set data in session
   */

  get<T>(moduleName: string): T;
  get<T>(moduleName: string, key: keyof T): T[keyof T];
  get<T>(moduleName: string, key?: keyof T): T | T[keyof T] {
    return this.localStorage.get<T>(moduleName, key);
  }

  set(moduleName: string, keyOrData: string | object, data?: unknown): void {
    return this.localStorage.set(moduleName, keyOrData, data);
  }

  getId(): string {
    return this.localStorage.getId();
  }

  /**
   * Lifecycle methods
   */
  reset(res: Response): Promise<string> {
    return this.lifecycle.reset(res);
  }

  initCache(sessionId: string): Promise<void> {
    return this.lifecycle.initCache(sessionId);
  }

  init(res: Response): string {
    return this.lifecycle.init(res);
  }

  destroy(res: Response) {
    return this.lifecycle.destroy(res);
  }

  commit(): Promise<boolean> {
    return this.lifecycle.commit();
  }

  duplicate(res: Response, schema: Type<unknown>) {
    return this.lifecycle.duplicate(res, schema);
  }

  refresh(req: Request, res: Response): Promise<string> {
    return this.lifecycle.refresh(req, res);
  }

  detach(res: Response) {
    return this.lifecycle.detach(res);
  }

  /**
   * Cookies methods
   */
  getSessionIdFromCookie(req: Request): string | undefined {
    return this.cookies.get(req);
  }

  /**
   * Backend storage specific methods
   */
  getDataFromBackend<T = unknown>(sessionId: string): Promise<T | never> {
    return this.backendStorage.get<T>(sessionId);
  }

  expire(sessionId: string, ttl: number): Promise<number> {
    return this.backendStorage.expire(sessionId, ttl);
  }

  setAlias(alias: string, sessionId: string): Promise<RedisQueryResult[]> {
    return this.backendStorage.setAlias(alias, sessionId);
  }

  getAlias(key: string): Promise<string> {
    return this.backendStorage.getAlias(key);
  }
}
