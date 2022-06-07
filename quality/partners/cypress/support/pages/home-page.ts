import { ChainableElement } from '../types';

export default class HomePage {
  checkIsVisible(): void {
    this.getLoginPageButton().should('be.visible');
  }

  getLoginPageButton(): ChainableElement {
    return cy.get('[data-testid="login-button"]');
  }
}
