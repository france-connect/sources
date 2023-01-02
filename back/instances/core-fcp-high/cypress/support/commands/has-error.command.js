export function hasError(errorCode, errorMessage = "Une erreur s'est produite") {
  cy.contains(
    '.main-title',
    errorMessage,
  );
  cy.contains('#error-code', `Erreur ${errorCode}`);
}
