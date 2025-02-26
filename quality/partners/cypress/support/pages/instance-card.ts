import { ChainableElement } from '../types';

export default class InstanceCard {
  index: number;

  constructor(index: number) {
    this.index = index;
  }

  getCardButton(): ChainableElement {
    return cy.get('[data-testid="CardComponent"]').eq(this.index);
  }

  getInstanceName(): ChainableElement {
    return this.getCardButton().find('[data-testid="CardComponent-title"] a');
  }

  getCreationDate(): ChainableElement {
    return this.getCardButton().find(
      '[data-testid="CardComponent-detail-top"]',
    );
  }

  getClientIdLabel(): ChainableElement {
    return this.getCardButton().find(
      '[data-testid="InstanceComponent-client-id"]',
    );
  }

  getClientSecretLabel(): ChainableElement {
    return this.getCardButton().find(
      '[data-testid="InstanceComponent-client-secret"]',
    );
  }

  getClientId(): Cypress.Chainable<string> {
    return this.getClientIdLabel()
      .invoke('text')
      .then((text) => text.trim());
  }

  getClientSecret(): Cypress.Chainable<string> {
    return this.getClientSecretLabel()
      .invoke('text')
      .then((text) => text.trim());
  }

  checkIsClientIdDisplayed(): void {
    this.getClientIdLabel().should('be.visible');
    this.getClientId().should('not.equal', '');
  }

  checkIsClientSecretDisplayed(): void {
    this.getClientSecretLabel().should('be.visible');
    this.getClientSecret().should('not.equal', '');
  }
}
