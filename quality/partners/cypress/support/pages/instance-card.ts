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
}
