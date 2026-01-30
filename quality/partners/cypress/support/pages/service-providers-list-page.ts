import { ChainableElement } from '../types';

export default class ServiceProvidersListPage {
  checkIsVisible(): void {
    cy.contains(
      '[data-testid="service-providers-page-title"]',
      'Mes fournisseurs de service',
    ).should('be.visible');
  }

  getInformationMessageByType(type: string): ChainableElement {
    return cy.get(`[data-testid="service-providers-page-notice-${type}"]`);
  }

  getServiceProvidersCardList(): ChainableElement {
    return cy.get('[data-testid="service-providers-card-list"]');
  }

  getAllServiceProvidersCards(): ChainableElement {
    return this.getServiceProvidersCardList().find(
      '[data-testid^="service-providers-card-"]',
    );
  }

  getServiceProviderCardByTitle(title: string): ChainableElement {
    return this.getAllServiceProvidersCards()
      .find('[data-testid="CardComponent-title"] a')
      .contains(title);
  }
}
