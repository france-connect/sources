export const navigateTo = ({
  appId,
  baseUrl,
}: {
  appId: string;
  baseUrl: string;
}): void => {
  Cypress.on('uncaught:exception', (_err, _runnable) => {
    return false;
  });
  cy.visit(baseUrl);
  cy.url().should('include', baseUrl);

  const selector = `#${appId}`;
  cy.get(selector).click();

  Cypress.on('uncaught:exception', (_err, _runnable) => {
    return true;
  });
};
