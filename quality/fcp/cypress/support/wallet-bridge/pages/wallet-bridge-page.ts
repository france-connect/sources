import { ChainableElement } from '../../common/types';

export default class WalletBridgePage {
  checkIsVisible(): void {
    this.getPageBody().should('be.visible');
  }

  getPageBody(): ChainableElement {
    return cy.get('body#wb-interaction-page');
  }

  getOpenWalletAppButton(): ChainableElement {
    return cy.get('[data-testid="wallet-open-app-button"]');
  }

  getQRCodeImage(): ChainableElement {
    return cy.get('[data-testid="wallet-qrcode"]');
  }

  getAboutLink(): ChainableElement {
    return cy.get('[data-testid="wallet-about-link"]');
  }

  getPendingStatusMessage(): ChainableElement {
    return cy.get('[data-testid="wallet-status-pending"]');
  }

  getSuccessStatusMessage(): ChainableElement {
    return cy.get('[data-testid="wallet-status-success"]');
  }

  getErrorStatusMessage(): ChainableElement {
    return cy.get('[data-testid="wallet-status-error"]');
  }

  getRequestUri(): Cypress.Chainable<string> {
    return this.getOpenWalletAppButton()
      .invoke('attr', 'href')
      .then((text) => {
        expect(text).to.exist;
        expect(text).to.be.a('string');
        const requestUri = (text as string).trim();
        expect(requestUri).to.not.be.empty;
        return requestUri;
      });
  }
}
