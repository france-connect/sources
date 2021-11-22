/**
 * Overwrite clearCookie to avoid desynchronize process
 * @param {Function} clearCookie the original function of clearCookie
 * @param {string} cookieName the name of the cookie
 * @param {Object} options the cypress option for clearCookie
 */

export function deleteCookie(clearCookie, cookieName, options) {
  Cypress.log({
    name: 'clearCookie',
    displayName: 'clearCookie',
    message: `Clear cookie : ${cookieName}`,
  }).snapshot();

  // check first if the cookie exists
  cy.getCookie(cookieName, { log: true })
    .should('exist')
    .then(() => {
      return clearCookie(cookieName, { ...options, log: true });
    });
  return cy.getCookie(cookieName, { log: true }).should('be.null');
}
