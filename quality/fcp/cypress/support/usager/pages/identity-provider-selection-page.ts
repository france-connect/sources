import {
  ChainableElement,
  IdentityProviderInterface,
} from '../../common/types';
import Modal from './modal-component';

export default class IdentityProviderSelectionPage {
  getBackToServiceProviderLink(): ChainableElement {
    return cy.get('[data-testid="back-to-sp-link"]');
  }

  getNotificationSection(): ChainableElement {
    return cy.get('section.fr-notice--info');
  }

  getIdpGrid(): ChainableElement {
    return cy.get('#grid-main-providers, [data-testid="main-providers"]');
  }

  getAllIdpForms(): ChainableElement {
    return this.getIdpGrid().find('form');
  }

  getAllIdpButtons(): ChainableElement {
    return this.getAllIdpForms().find('button');
  }

  getIdpButton(idp: IdentityProviderInterface): ChainableElement {
    return cy.get(idp.selectors.idpButton, { timeout: 0 });
  }

  getAidantsConnectButton(): ChainableElement {
    return cy.get('[data-testid="interaction-aidants-connect-button"]');
  }

  getIdpSelectionModal(idpId: string): Modal {
    const selector = `[data-testid="provider-selection-modal-${idpId}"]`;
    const modal = new Modal(selector);
    return modal;
  }

  getLoadingModal(): ChainableElement {
    return cy.get('#loading-modal');
  }

  checkIsVisible(): void {
    this.getIdpGrid().should('be.visible');
  }

  modifyProviderUidOfIdpButton(
    idp: IdentityProviderInterface,
    providerUid: string,
  ): void {
    this.getIdpButton(idp)
      .parent()
      .find('input[name="providerUid"]')
      .invoke('attr', 'value', providerUid);
  }

  modifyCsrfOfIdpButton(idp: IdentityProviderInterface, csrf: string): void {
    this.getIdpButton(idp)
      .parent()
      .find('input[name="csrfToken"]')
      .invoke('attr', 'value', csrf);
  }

  checkIsNotificationMessageDisplayed(message: string): void {
    if (message) {
      this.getNotificationSection().should('be.visible').contains(message);
    } else {
      this.getNotificationSection().should('not.exist');
    }
  }

  checkIsLoadingModalVisible(): void {
    this.getLoadingModal()
      .should('exist')
      .and('be.visible')
      .and('have.attr', 'open');
  }
}
