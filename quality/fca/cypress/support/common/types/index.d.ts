/// <reference types="cypress" />

export * from './environment';
export * from './identity-provider';
export * from './identity-provider-config';
export * from './service-provider';
export * from './service-provider-config';
export * from './user';

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
