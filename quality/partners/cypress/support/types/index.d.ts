/// <reference types="cypress" />

export * from './environment';
export * from './role';
export * from './service-provider';
export * from './service-provider-role';
export * from './user';

// Cypress Alias
// eslint-disable-next-line no-undef
export type ChainableElement = Cypress.Chainable<JQuery<HTMLElement>>;
