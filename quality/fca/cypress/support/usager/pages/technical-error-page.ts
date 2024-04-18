export default class TechnicalErrorPage {
  checkIsVisible(): void {
    cy.get('h1').should('contain', 'Accès impossible');
  }

  checkErrorCode(errorCode: string): void {
    cy.get('[data-testid="error-code"]').should(
      'contain',
      `code erreur : ${errorCode}`,
    );
  }

  checkErrorMessage(errorMessage: string): void {
    cy.get('[data-testid="error-message"]').should(
      'contain',
      `${errorMessage}`,
    );
  }

  checkSessionNumberVisible(): void {
    cy.contains('[data-testid="error-session-id"]')
      .invoke('text')
      .should(
        'match',
        /^ID : [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
  }
}
