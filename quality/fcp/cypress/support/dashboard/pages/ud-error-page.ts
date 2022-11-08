export default class UdErrorPage {
  checkIsVisible(): void {
    cy.url().should('includes', '/error');
    cy.contains('h2', 'Une erreur est survenue');
  }

  checkForbiddenError(): void {
    cy.contains('h6', 'Erreur 409');
    cy.contains(
      '#page-container',
      'Vous n’avez pas les droits d’effectuer cette action',
    );
  }
}
