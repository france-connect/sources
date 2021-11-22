/// <reference types="cypress" />

export * from './environment';
export * from './identity-provider';
export * from './service-provider';
export * from './user';

// Cypress Alias
// eslint-disable-next-line no-undef
export type ChainableElement = Cypress.Chainable<JQuery<HTMLElement>>;
