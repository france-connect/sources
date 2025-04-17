import { ChainableElement } from '../types';

export default class LoginPage {
  getLoginButton(): ChainableElement {
    return cy.get('[data-testid="LoginConnectComponent"] button');
  }

  checkIsVisible(): void {
    this.getLoginButton().should('be.visible');
  }

  getExpiredSessionAlert(): ChainableElement {
    return cy.get('[data-testid="AlertComponent"]');
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
