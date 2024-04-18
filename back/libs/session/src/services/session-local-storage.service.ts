import { cloneDeep } from 'lodash';

import { Injectable } from '@nestjs/common';

import { AsyncLocalStorageService } from '@fc/async-local-storage';

import {
  SessionStoreContentInterface,
  SessionStoreInterface,
} from '../interfaces';
import { SESSION_STORE_KEY } from '../tokens';

@Injectable()
export class SessionLocalStorageService {
  constructor(
    private readonly asyncLocalStorage: AsyncLocalStorageService<SessionStoreInterface>,
  ) {}

  getStore(): SessionStoreContentInterface {
    const store = this.asyncLocalStorage.get(SESSION_STORE_KEY);

    if (!store) {
      return {
        data: {},
        id: undefined,
        sync: false,
      };
    }
    return store;
  }

  setStore(payload: SessionStoreContentInterface): void {
    this.asyncLocalStorage.set(SESSION_STORE_KEY, payload);
  }

  getId(): string {
    const session = this.getStore();

    return session.id;
  }

  get<T>(moduleName: string): T;
  get<T>(moduleName: string, key: keyof T): T[keyof T];
  get<T>(moduleName: string, key?: keyof T): T | T[keyof T] {
    const store = this.getStore();

    if (key) {
      return store.data[moduleName]?.[key];
    }

    return store.data[moduleName];
  }

  set(moduleName: string, keyOrData: string | object, data?: unknown): void {
    const store = this.getStore();

    if (typeof keyOrData === 'string') {
      this.setByKey(moduleName, store.data, keyOrData, data);
    } else if (typeof keyOrData === 'object') {
      this.setModule(moduleName, store.data, keyOrData);
    }

    /**
     * Mutate store in place.
     *
     * since store is a reference to the object in the asyncLocalStorage,
     * we technically don't need to call `asyncLocalStorage.set()`
     * and it would be adding unnecessary overhead at runtime,
     * without even providing any benefits from a readability perspective.
     */
    store.sync = false;
  }

  /**
   * Deep clones the input before assignation
   * to avoid later mutations to affect the session
   */
  private setByKey(
    moduleName: string,
    session: object,
    key: string,
    data: unknown,
  ): void {
    if (!session[moduleName]) {
      session[moduleName] = {};
    }

    session[moduleName][key] = cloneDeep(data);
  }

  /**
   * Deep clones the input before assignation
   * to avoid later mutations to affect the session
   */
  private setModule(moduleName: string, session: object, data: object): void {
    session[moduleName] = {
      ...session[moduleName],
      ...cloneDeep(data),
    };
  }
}
