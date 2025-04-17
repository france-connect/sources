import { ChainableElement } from '../types';

export default class TopMenuComponent {
  visitHomePage(): void {
    cy.visit('/');
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

  checkIsConnected(isConnected = true): void {
    const state = isConnected ? 'exist' : 'not.exist';
    cy.request({
      failOnStatusCode: false,
      url: '/api/me',
    })
      .its('body')
      .its('accountId')
      .should(state);
  }
}
