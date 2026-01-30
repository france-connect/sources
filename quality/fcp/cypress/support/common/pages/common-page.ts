import { ChainableElement } from '../types';

export default class CommonPage {
  getSkiplinks(): ChainableElement {
    return cy.get('.fr-skiplinks');
  }

  getSkiplinksList(): ChainableElement {
    return this.getSkiplinks().find('.fr-skiplinks__list');
  }

  getSkiplinksItems(): ChainableElement {
    return this.getSkiplinksList().find('.fr-link');
  }

  getFocusedElement(): ChainableElement {
    return cy.focused();
  }

  getMainContent(): ChainableElement {
    return cy.get('#main-content');
  }

  getFooter(): ChainableElement {
    return cy.get('#footer');
  }
}
