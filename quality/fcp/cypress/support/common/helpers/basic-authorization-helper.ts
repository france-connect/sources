/**
 * Functions to handle Basic Authorization used to access FC test environments
 * when outside FC network
 */

/**
 * Calculates the Basic Authorization token
 * @returns the token to add to the Authorization header
 */
const getFCBasicAuthorizationToken = (
  username: string,
  password: string,
): string => {
  return window.btoa(`${username}:${password}`);
};

/**
 * Adds the Basic Authorization header to all FC requests
 */
export const addFCBasicAuthorization = (
  username: string,
  password: string,
): void => {
  const token = getFCBasicAuthorizationToken(username, password);
  cy.intercept(/.*dev-franceconnect.fr.*/, (req) => {
    req.headers['Authorization'] = `Basic ${token}`;
  }).as('FC:auth');
};

/**
 * Checks whether the Basic Authorization header has been added
 */
export const checkFCBasicAuthorization = (
  username: string,
  password: string,
): void => {
  const token = getFCBasicAuthorizationToken(username, password);
  cy.wait('@FC:auth')
    .its('request.headers')
    .should('have.property', 'Authorization', `Basic ${token}`);
};
