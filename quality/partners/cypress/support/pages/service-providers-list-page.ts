import { ChainableElement } from '../types';

const SERVICE_PROVIDERS_LIST_TIMEOUT = 10000;

export default class ServiceProvidersListPage {
  checkIsVisible(): void {
    cy.contains(
      '[data-testid="service-providers-page-title"]',
      'Mes fournisseurs de service',
      {
        timeout: SERVICE_PROVIDERS_LIST_TIMEOUT,
      },
    ).should('be.visible');
  }

  getInformationMessageByType(type: string): ChainableElement {
    return cy.get(`[data-testid="service-providers-page-notice-${type}"]`);
  }

  getServiceProvidersCardList(): ChainableElement {
    this.checkIsVisible();

    return cy.get('[data-testid="service-providers-card-list"]', {
      timeout: SERVICE_PROVIDERS_LIST_TIMEOUT,
    });
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

  getServiceProviderCardByRequestId(requestId: string): ChainableElement {
    return this.getAllServiceProvidersCards()
      .contains(
        '[data-testid="ServiceProviderCardComponent-request-id"]',
        requestId,
      )
      .closest('[data-testid^="service-providers-card-"]')
      .find('[data-testid="CardComponent-title"] a');
  }
}
