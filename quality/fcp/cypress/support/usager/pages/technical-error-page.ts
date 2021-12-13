export default class TechnicalErrorPage {
  checkIsVisible(): void {
    cy.get('h1.main-title').contains(
      'Une erreur technique est survenue lors de la connexion.',
    );
  }

  checkErrorCode(errorCode: string): void {
    cy.get('#error-code').contains(errorCode);
  }

  checkErrorMessage(message: string): void {
    cy.get('#error-message').contains(message);
  }

  checkSessionNumberVisible(): void {
    /**
     * @TODO Change css selector once unique selector will be implemented
     */
    cy.get('div.detail-error-container > p:nth-child(3)')
      .invoke('text')
      .should(
        'match',
        /ID : [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
      );
  }
}
