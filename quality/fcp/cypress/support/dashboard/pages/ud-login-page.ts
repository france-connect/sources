import { ChainableElement } from '../../common/types';

export default class UdLoginPage {
  udRootUrl: string;

  constructor(udRootUrl: string) {
    this.udRootUrl = udRootUrl;
  }

  getAuthorizeButton(): ChainableElement {
    return cy.get('button[type="submit"]');
  }

  checkIsVisible(): void {
    cy.url().should('include', this.udRootUrl);
    this.getAuthorizeButton().should('be.visible');
  }
}
