/// <reference types="cypress" />

import { Environment } from './environment';
import { Instance } from './instance';
import { UserData } from './user';

// Cypress Alias
// eslint-disable-next-line no-undef
export type ChainableElement = Cypress.Chainable<JQuery<HTMLElement>>;

declare global {
  namespace Cypress {
    interface Chainable {
      // custom commands
      clearThenType(text: string, options?: Partial<Cypress.TypeOptions>): void;
    }
  }
}

// Define Cucumber world interface
declare module 'mocha' {
  export interface Context {
    // BDD context
    env: Environment;
    instances: Instance[];
    instance: Instance;
    users: UserData[];
    user: UserData;
  }
}

export * from './environment';
export * from './instance';
export * from './user';
