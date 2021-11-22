export const navigateTo = ({
  appId,
  baseUrl,
}: {
  appId: string;
  baseUrl: string;
}): void => {
  cy.visit(baseUrl);
  cy.url().should('include', baseUrl);

  const selector = `#${appId}`;
  cy.get(selector).click();
};
