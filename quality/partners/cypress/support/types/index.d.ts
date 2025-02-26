/// <reference types="cypress" />

import { Environment } from './environment';
import { Instance } from './instance';
import { RmqMessage } from './rmq-message';
import { UserData } from './user';

// Cypress Alias
// eslint-disable-next-line no-undef
export type ChainableElement = Cypress.Chainable<JQuery<HTMLElement>>;

declare global {
  namespace Cypress {
    interface Chainable {
      // custom commands
      clearThenType(text: string, options?: Partial<Cypress.TypeOptions>): void;
      checkWithinViewport(isWithinViewport: boolean): void;
    }
  }
}

// Define Cucumber world interface
declare module 'mocha' {
  export interface Context {
    // API context
    apiRequests: Partial<Cypress.RequestOptions>[];
    apiRequest?: Partial<Cypress.RequestOptions>;
    rmqRequestMessage: RmqMessage;
    rmqResponseMessage: RmqMessage;
    // BDD context
    env: Environment;
    instances: Instance[];
    instance: Instance;
    users: UserData[];
    user: UserData;
    // Postgres context
    pgVersions: object[];
  }
}

export * from './environment';
export * from './instance';
export * from './rmq-message';
export * from './user';
