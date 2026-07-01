import { ChainableElement, ServiceProvider } from '../types';

export default class ServiceProviderPage {
  getServiceProviderIdFromUrl(): Cypress.Chainable<string> {
    return cy.url().then((url) => {
      const match = url.match(/\/fournisseurs-de-service\/([^/?#]+)$/);
      expect(match, 'service provider uuid in page url').to.not.be.null;
      return match?.[1] as string;
    });
  }

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

  getOrganizationName(): ChainableElement {
    return cy.get(
      '[data-testid="service-provider-details-page-organization-name"]',
    );
  }

  checkServiceProviderDetails(serviceProvider: ServiceProvider): void {
    this.getTitle(serviceProvider.name).should('be.visible');
    this.getOrganizationName()
      .should('be.visible')
      .and('have.text', serviceProvider.organizationName);
    this.getDatapassRequestIdLink()
      .should('be.visible')
      .and('have.text', serviceProvider.datapassRequestId);
  }

  getDatapassScopesList(): ChainableElement {
    return cy.get(
      'li[data-testid^="service-provider-scopes-tab-datapass-scope"]',
    );
  }

  getFcScopesList(): ChainableElement {
    return cy.get('li[data-testid^="service-provider-scopes-tab-fc-scope"]');
  }

  getFcScopesTabButton(): ChainableElement {
    return cy.get('[data-testid="fc-scopes-tab-button"]');
  }

  checkTabPanelVisible(tabId: string): void {
    cy.get(
      `[data-testid="service-provider-scopes-tabs-panel-${tabId}"]`,
    ).should('be.visible');
  }
}
