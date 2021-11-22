import { ChainableElement } from '../../common/types';

export default class IdentityProviderSelectionPage {
  get backToServiceProviderLink(): ChainableElement {
    return cy.get('.previous-link-container');
  }

  checkIsVisible(): void {
    cy.url().should('include', `/api/v2/interaction`);
  }

  searchIdentityProvider(terms: string): void {
    cy.get('#fi-search-term').clear().type(terms);
  }

  getIdpButton(idpId: string): ChainableElement {
    return cy.get(`#idp-${idpId}-button`);
  }
}
