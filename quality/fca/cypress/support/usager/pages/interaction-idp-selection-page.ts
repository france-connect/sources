import { ChainableElement } from '../../common/types';

export default class InteractionIdpSelectionPage {
  getSelectableIdps(): ChainableElement {
    return cy.get('#radio-hint label');
  }
}
