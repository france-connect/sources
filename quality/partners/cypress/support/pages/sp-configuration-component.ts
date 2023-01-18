import { ChainableElement } from '../types';

export default class SPConfigurationComponent {
  index: number;

  constructor(index: number) {
    this.index = index;
  }

  getConfigurationContainer(): ChainableElement {
    return cy.get('section[data-testid^="AccordionComponent"]').eq(this.index);
  }

  getTitle(): ChainableElement {
    return this.getConfigurationContainer().find(
      '[data-testid="AccordionComponent-title"]',
    );
  }
}
