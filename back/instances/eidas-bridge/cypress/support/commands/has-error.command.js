export function hasError(errorCode) {
  cy.contains(
    '.main-title',
    'Une erreur technique est survenue lors de la connexion.',
  );
  cy.contains('#error-code', `Code d'erreur : ${errorCode}`);
}
