import { ChainableElement } from '../../common/types';

export default class UdFraudLoginPage {
  udFraudRootUrl: string;

  constructor(udFraudRootUrl: string) {
    this.udFraudRootUrl = udFraudRootUrl;
  }

  getExpiredSessionAlert(): ChainableElement {
    return cy.get('[data-testid="AlertComponent"]');
  }

  getAuthorizeButton(): ChainableElement {
    return cy.get('button[type="submit"]');
  }

  getFraudSupportFormLink(): ChainableElement {
    return cy.get('[data-testid="fraud-support-form-link"]');
  }

  checkIsVisible(): void {
    cy.url().should('include', this.udFraudRootUrl);
    this.getFraudSupportFormLink().should('be.visible');
    this.getAuthorizeButton().should('be.visible');
  }

  checkIsExpiredSessionAlertDisplayed(displayed: boolean): void {
    if (displayed) {
      cy.contains(
        '[data-testid="AlertComponent"]',
        'Votre session a expiré, veuillez vous reconnecter',
      );
    } else {
      this.getExpiredSessionAlert().should('not.exist');
    }
  }
}
