import { ChainableElement } from '../../common/types';

export default class EidasBridgePage {
  checkIsVisible(): void {
    this.getCountryGrid().should('be.visible');
  }

  getCountryGrid(): ChainableElement {
    return cy.get('[data-testid="country-flags"]');
  }

  getCountryButton(country: string): ChainableElement {
    return this.getCountryGrid().contains('button', country);
  }
}
