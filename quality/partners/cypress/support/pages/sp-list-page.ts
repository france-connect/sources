import { serviceProviderStatus } from '../helpers/service-provider-helper';
import { ChainableElement, ServiceProvider } from '../types';

export default class SPListPage {
  checkIsVisible(): void {
    cy.url().should('include', '/service-providers');
  }

  getPageTitle(): ChainableElement {
    return cy.get('[data-testid="ServiceProvidersPageTitleComponent-title"]');
  }

  getNoSpAlert(): ChainableElement {
    return cy.get('[data-testid="ServiceProvidersListComponent-alert"]');
  }

  getAllServiceProviders(): ChainableElement {
    return cy.get('[data-testid="ServiceProviderItemComponent"]');
  }

  // Index starting with 0
  getServiceProvider(index: number): ServiceProviderComponent {
    return new ServiceProviderComponent(index);
  }
}

class ServiceProviderComponent {
  index: number;

  constructor(index: number) {
    this.index = index;
  }

  getSpContainer(): ChainableElement {
    return cy
      .get(`[data-testid="ServiceProviderItemComponent"]`)
      .eq(this.index);
  }

  getSpBadge(): ChainableElement {
    return this.getSpContainer().find(
      '[data-testid="ServiceProviderItemComponent-badge"]',
    );
  }

  getSpName(): ChainableElement {
    return this.getSpContainer().find(
      '[data-testid="ServiceProviderItemComponent-spName"]',
    );
  }

  getOrganisationName(): ChainableElement {
    return this.getSpContainer().find(
      '[data-testid="ServiceProviderItemComponent-organisationName"]',
    );
  }

  getPlatformName(): ChainableElement {
    return this.getSpContainer().find(
      '[data-testid="ServiceProviderItemComponent-platform"]',
    );
  }

  getDatapassId(): ChainableElement {
    return this.getSpContainer().find(
      '[data-testid="ServiceProviderItemComponent-datapassId"]',
    );
  }

  getCreationDate(): ChainableElement {
    return this.getSpContainer().find(
      '[data-testid="ServiceProviderItemComponent-createdAt"]',
    );
  }

  checkDetails(serviceProvider: ServiceProvider): void {
    this.getSpName().should('have.text', serviceProvider.name);
    this.getSpBadge().should(
      'have.text',
      serviceProviderStatus[serviceProvider.status],
    );
    this.getOrganisationName().should(
      'have.text',
      serviceProvider.organisation,
    );
    this.getPlatformName().should('have.text', serviceProvider.platform);
    this.getDatapassId().should(
      'have.text',
      `Datapass N°⚠️${serviceProvider.datapassId}⚠️`,
    );
    this.getCreationDate().should(
      'have.text',
      `Créé le : ${serviceProvider.creationDate}`,
    );
  }
}
