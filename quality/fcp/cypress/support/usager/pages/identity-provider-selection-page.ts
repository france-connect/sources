import { ChainableElement } from '../../common/types';

export default class IdentityProviderSelectionPage {
  get backToServiceProviderLink(): ChainableElement {
    return cy.get('.previous-link-container');
  }

  getIdpButton(idpId: string): ChainableElement {
    return cy.get(`button[id="idp-${idpId}"]`);
  }

  checkIsVisible(): void {
    cy.url().should('include', `/api/v2/interaction`);
  }
}
