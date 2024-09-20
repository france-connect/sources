import { ChainableElement } from '../types';

export default class LoginPage {
  getLoginButton(): ChainableElement {
    return cy.get('[data-testid="LoginConnectButton"] button');
  }

  checkIsVisible(): void {
    this.getLoginButton().should('be.visible');
  }
}