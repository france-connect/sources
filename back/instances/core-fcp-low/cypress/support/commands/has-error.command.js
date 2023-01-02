export function hasError(errorCode) {
  cy.contains(
    '.main-title',
    "Une erreur s'est produite",
  );
  cy.contains('#error-code', `Erreur ${errorCode}`);
}
