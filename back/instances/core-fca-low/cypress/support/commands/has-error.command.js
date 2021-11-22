export function hasError(errorCode) {
  cy.get('h1').contains('🚨 Erreur 😓 !');
  cy.get('pre').contains(`code : ${errorCode}`);
}
