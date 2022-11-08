import { ChainableElement } from '../types';

export default class SPDetailPage {
  checkIsVisible(): void {
    this.getSpName().should('be.visible');
  }

  getReturnToSpListButton(): ChainableElement {
    return cy.get(
      '[data-testid="ServiceProvidersDetailsHeaderComponent-return-sp-list-button"]',
    );
  }

  getSpBadge(): ChainableElement {
    return cy.get(
      '[data-testid="ServiceProvidersDetailsHeaderComponent-badge"]',
    );
  }

  getSpName(): ChainableElement {
    return cy.get(
      '[data-testid="ServiceProvidersDetailsHeaderComponent-spName"]',
    );
  }

  getPlatformName(): ChainableElement {
    return cy.get(
      '[data-testid="ServiceProvidersDetailsHeaderComponent-platform"]',
    );
  }
}
