import { ChainableElement } from '../types';

export default class TopMenuComponent {
  getNavigationLink(label: string): ChainableElement {
    return cy.contains(
      'header[role="banner"] nav[role="navigation"] a.fr-nav__link',
      label,
    );
  }

  getUserLabel(): ChainableElement {
    return cy.get(
      '.fr-header__tools [data-testid="layout-header-tools-account-component"]',
    );
  }

  getLogoutLink(): ChainableElement {
    return cy.get(
      '.fr-header__tools [data-testid="layout-header-tools-logout-button"]',
    );
  }

  getOpenMobileMenuButton(): ChainableElement {
    return cy.get('[data-testid="burger-button-mobile-menu"]');
  }

  checkIsLogoutLinkVisible(isVisible = true): void {
    const state = isVisible ? 'be.visible' : 'not.exist';
    this.getLogoutLink().should(state);
  }

  checkIsConnected(partnersRootUrl: string, isConnected = true): void {
    const state = isConnected ? 'exist' : 'not.exist';
    cy.request({
      failOnStatusCode: false,
      url: `${partnersRootUrl}/api/me`,
    })
      .its('body')
      .its('accountId')
      .should(state);
  }
}
