export function hasError(errorCode, errorMessage = 'Une erreur technique est survenue lors de la connexion.') {
  cy.contains(
    '.main-title',
    errorMessage,
  );
  cy.contains('#error-code', `Code d'erreur : ${errorCode}`);
}
