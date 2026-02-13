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

  getOrganizationName(): ChainableElement {
    return cy.get(
      '[data-testid="service-provider-details-page-organization-name"]',
    );
  }

  getDatapassScopesList(): ChainableElement {
    return cy.get(
      '[data-testid="service-provider-scopes-tabs-datapass-scope"]',
    );
  }

  getFcScopesList(): ChainableElement {
    return cy.get('[data-testid="service-provider-scopes-tabs-fc-scope"]');
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
