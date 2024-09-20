/// <reference types="cypress" />

export * from './environment';
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
