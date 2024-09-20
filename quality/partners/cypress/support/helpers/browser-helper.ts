export const waitForConnectionStatus = (
  timeout = 2000,
): Cypress.Chainable<unknown> =>
  cy.wait('@api:me', { responseTimeout: timeout });
