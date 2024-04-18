import { ChainableElement } from '../../common/types';

export default class Modal {
  constructor(private modalSelector: string) {
    this.modalSelector = modalSelector;
  }

  getContinueButton(): ChainableElement {
    const selector = "[data-testid='modal-continue-button']";
    return this.getModal().find(selector);
  }

  getCancelButton(): ChainableElement {
    const selector = "[data-testid='modal-cancel-button']";
    return this.getModal().find(selector);
  }

  getCloseButton(): ChainableElement {
    const selector = "[data-testid='modal-close-button']";
    return this.getModal().find(selector);
  }

  getModal(): ChainableElement {
    return cy.get(this.modalSelector);
  }
}
