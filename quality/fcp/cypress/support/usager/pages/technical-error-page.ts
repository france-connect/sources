import { ChainableElement } from '../../common/types';

export default class TechnicalErrorPage {
  checkEidasErrorPageIsVisible(): void {
    cy.get('[data-testid="eidas-error-section"]').should('be.visible');
  }

  checkIsVisible(): void {
    cy.get('[data-testid="error-section"]').should('be.visible');
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
      buttonType === 'support'
        ? 'Contacter le support'
        : 'Consulter la page d’aide';
    cy.get('[data-testid="error-support-button"]').contains(label);
  }

  checkSupportLinkHref(errorCode: string): void {
    cy.get('[data-testid="error-support-button"]').should(($button) => {
      const linkTarget = $button.attr('href') || $button.attr('value') || '';
      expect(linkTarget.toLowerCase()).to.contain(errorCode.toLowerCase());
    });
  }

  getBackToSPLink(): ChainableElement {
    return cy.get('[data-testid="back-to-sp-link"]');
  }
}
