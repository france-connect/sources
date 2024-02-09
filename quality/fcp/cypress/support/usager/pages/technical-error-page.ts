import { ChainableElement } from '../../common/types';

export default class TechnicalErrorPage {
  checkIsVisible(): void {
    cy.get('[data-testid="error-section"]').should('be.visible');
  }

  checkErrorTitle(message: string): void {
    cy.get('[data-testid="error-section-title"]').contains(message);
  }

  checkErrorCode(errorCode: string): void {
    cy.get('[data-testid="error-code"]').contains(errorCode);
  }

  checkErrorMessage(message: string): void {
    cy.get('[data-testid="error-message"]').contains(message);
  }

  getBackToSPLink(): ChainableElement {
    return cy.get('[data-testid="back-to-sp-link"]');
  }
}
