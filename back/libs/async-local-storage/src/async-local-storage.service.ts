import { AsyncLocalStorage } from 'async_hooks';

import { Injectable } from '@nestjs/common';

import { AsyncLocalStorageNotFoundException } from './exceptions';

@Injectable()
/**
 * This `any` type is authorized since we don't know the type of the data we want to store and `unknown` will not work.
 * Providing T will enforce the type of the data we want to store even with the `any` type.
 */
export class AsyncLocalStorageService<T extends Record<string, any>> {
  private storage: AsyncLocalStorage<Map<string, unknown>>;

  onModuleInit() {
    this.storage = new AsyncLocalStorage<Map<string, unknown>>();
  }

  run(callback: () => void) {
    this.storage.run(new Map(), callback);
  }

  /**
   * You should always use this if store access is mandatory.
   * This will throw an error if the storage is not available.
   */
  get mandatory(): this {
    /**
     * We need protection here because some libs (ex logger) are initialized in the constructor
     * whereas the logger is initialized in the onModuleInit method.
     */
    if (!this.storage) {
      throw new AsyncLocalStorageNotFoundException();
    }

    return this;
  }

  get<K extends keyof T>(key: K): T[K] | undefined {
    const currentStore = this.getStore();

    if (!currentStore) {
      return;
    }

    return currentStore.get(key as string) as T[K];
  }

  set<K extends keyof T>(key: K, value: T[K]) {
    const currentStore = this.storage.getStore();

    currentStore.set(key as string, value);
  }

  private getStore(): Map<string, unknown> | undefined {
    if (!this.storage) {
      return;
    }

    return this.storage.getStore();
  }
}
