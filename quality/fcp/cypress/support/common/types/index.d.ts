/// <reference types="cypress" />

import { Maildev } from './maildev';

declare global {
  namespace Cypress {
    interface Chainable {
      maildevGetAllMessages(): Cypress.Chainable<Maildev.Mail[]>;
      maildevGetLastMessage(): Cypress.Chainable<Maildev.Mail>;
      maildevVisitMessageById(id: string): void;
      maildevDeleteMessageById(id: string): void;
    }
  }
}

// Cypress Alias
// eslint-disable-next-line no-undef
export type ChainableElement = Cypress.Chainable<JQuery<HTMLElement>>;

export * from './environment';
export * from './identity-provider';
export * from './maildev';
export * from './service-provider';
export * from './user';
