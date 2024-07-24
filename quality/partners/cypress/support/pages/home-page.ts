import { ChainableElement } from '../types';

export default class HomePage {
  visit(): void {
    cy.visit('/');
  }

  getLoginButton(): ChainableElement {
    return cy.get('[data-testid="login-button"]');
  }
}
