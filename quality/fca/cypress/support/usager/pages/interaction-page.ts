import { ChainableElement } from '../../common/types';

export default class InteractionPage {
  checkIsVisible(): void {
    cy.url().should('include', '/api/v2/interaction');
  }

  getEmail(): ChainableElement {
    return cy.get('#email-input');
  }

  getConnectionButton(): ChainableElement {
    return cy.get('[data-testid="interaction-connection-button"]');
  }
}
