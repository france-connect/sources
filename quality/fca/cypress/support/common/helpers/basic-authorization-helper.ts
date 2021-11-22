/**
 * Functions to handle Basic Authorization used to access FC test environments
 * when outside FC network
 */

/**
 * Calculates the Basic Authorization token
 * @returns the token to add to the Authorization header
 */
const getFCBasicAuthorizationToken = (): string => {
  const username = Cypress.env('FC_ACCESS_USER');
  const password = Cypress.env('FC_ACCESS_PASS');
  return window.btoa(`${username}:${password}`);
};

/**
 * Returns true if a FC credentials has been configured to run the tests
 * @returns true if a FC_ACCESS_USER env variable has been set
 */
export const isUsingFCBasicAuthorization = (): boolean =>
  !!Cypress.env('FC_ACCESS_USER');

/**
 * Adds the Basic Authorization header to all FC requests
 */
export const addFCBasicAuthorization = (): void => {
  const token = getFCBasicAuthorizationToken();
  cy.intercept(/.*dev-franceconnect.fr.*/, (req) => {
    req.headers['Authorization'] = `Basic ${token}`;
  }).as('FC:auth');
};

/**
 * Checks whether the Basic Authorization header has been added
 */
export const checkFCBasicAuthorization = (): void => {
  const token = getFCBasicAuthorizationToken();
  cy.wait('@FC:auth')
    .its('request.headers')
    .should('have.property', 'Authorization', `Basic ${token}`);
};
