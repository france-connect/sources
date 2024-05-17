export default class TechnicalErrorPage {
  checkIsVisible(): void {
    cy.get('[data-testid="error-section"]').should('be.visible');
  }

  checkErrorCode(errorCode: string): void {
    cy.get('[data-testid="error-code"]').should(
      'contain',
      `code erreur : ${errorCode}`,
    );
  }

  checkErrorTitle(errorTitle: string): void {
    cy.get('[data-testid="error-section-title"]').should('contain', errorTitle);
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
