export default class TechnicalErrorPage {
  checkIsVisible(): void {
    cy.get('h1.main-title').contains("Une erreur s'est produite");
  }

  checkErrorCode(errorCode: string): void {
    cy.get('#error-code').contains(errorCode);
  }

  checkErrorMessage(message: string): void {
    cy.get('#error-message').contains(message);
  }
}
