import { ChainableElement, IdentityProvider } from '../../common/types';
import Modal from './modal-component';

export default class IdentityProviderSelectionPage {
  getBackToServiceProviderLink(): ChainableElement {
    return cy.get('[data-testid="back-to-sp-link"]');
  }

  getIdpGrid(): ChainableElement {
    return cy.get('[data-testid="main-providers"]');
  }

  getIdpButton(idp: IdentityProvider): ChainableElement {
    return cy.get(idp.selectors.idpButton);
  }

  getAidantsConnectButton(): ChainableElement {
    return cy.get('[data-testid="interaction-aidants-connect-button"]');
  }

  getIdpSelectionModal(idpId: string): Modal {
    const selector = `[data-testid="provider-selection-modal-${idpId}"]`;
    const modal = new Modal(selector);
    return modal;
  }

  checkIsVisible(): void {
    this.getIdpGrid().should('be.visible');
  }

  modifyProviderUidOfIdpButton(
    idp: IdentityProvider,
    providerUid: string,
  ): void {
    this.getIdpButton(idp)
      .parent()
      .find('input[name="providerUid"]')
      .invoke('attr', 'value', providerUid);
  }

  modifyCsrfOfIdpButton(idp: IdentityProvider, csrf: string): void {
    this.getIdpButton(idp)
      .parent()
      .find('input[name="csrfToken"]')
      .invoke('attr', 'value', csrf);
  }
}
