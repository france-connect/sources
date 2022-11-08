import { ChainableElement } from '../types';

export default class SPDetailPage {
  checkIsVisible(): void {
    this.getSpName().should('be.visible');
  }

  getReturnToSpListButton(): ChainableElement {
    return cy.get(
      '[data-testid="ServiceProviderHeaderComponent-return-sp-list-button"]',
    );
  }

  getSpBadge(): ChainableElement {
    return cy.get(
      '[data-testid="ServiceProviderHeaderComponent-badge"]',
    );
  }

  getSpName(): ChainableElement {
    return cy.get(
      '[data-testid="ServiceProviderHeaderComponent-spName"]',
    );
  }

  getPlatformName(): ChainableElement {
    return cy.get(
      '[data-testid="ServiceProviderHeaderComponent-platform"]',
    );
  }
}
