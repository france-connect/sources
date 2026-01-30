import { ChainableElement } from '../types';

export default class ServiceProviderPage {
  getTitle(title: string): ChainableElement {
    return cy.contains('h1', title);
  }

  getDatapassRequestIdLink(): ChainableElement {
    return cy.get(
      '[data-testid="service-provider-details-page-datapass-request-id"]',
    );
  }

  checkIsErrorPageVisible(): void {
    cy.contains('h1', 'Vous ne voyez pas de fournisseur de service ?').should(
      'be.visible',
    );
  }
}
