import { ChainableElement } from '../../common/types';

export default class TechnicalErrorPage {
  checkEidasErrorPageIsVisible(): void {
    cy.get('[data-testid="eidas-error-section"]').should('be.visible');
  }

  checkIsVisible(): void {
    cy.get('[data-testid="error-section"]').should('be.visible');
  }

  checkErrorTitle(message: string): void {
    cy.get('[data-testid="error-section-title"]').contains(message);
  }

  checkErrorSubTitle(message: string): void {
    cy.get('[data-testid="error-section-subtitle"]').contains(message);
  }

  checkErrorCode(errorCode: string): void {
    cy.get('[data-testid="error-code"]').contains(errorCode);
  }

  checkErrorMessage(message: string): void {
    cy.get('[data-testid="error-message"]').contains(message);
  }

  checkIsSupportButtonVisible(buttonType: 'support' | 'faq'): void {
    const label =
      buttonType === 'support' ? 'Contactez-nous' : 'Consulter la page d’aide';
    cy.get('[data-testid="error-support-button"]').contains(label);
  }

  checkSupportLinkHref(errorCode: string): void {
    cy.get('[data-testid="error-support-button"]')
      .invoke('attr', 'value')
      .contains(errorCode);
  }

  getBackToSPLink(): ChainableElement {
    return cy.get('[data-testid="back-to-sp-link"]');
  }
}
