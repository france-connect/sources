import { ChainableElement } from '../../common/types';

export default class InteractionPage {
  checkIsVisible(): void {
    this.getConnectionButton().should('be.visible');
  }

  getEmail(): ChainableElement {
    return cy.get('#email-input');
  }

  getConnectionButton(): ChainableElement {
    return cy.get('[data-testid="interaction-connection-button"]');
  }
}
