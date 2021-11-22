import { ChainableElement } from '../../common/types';

export default class UdHistoryPage {
  udRootUrl: string;

  constructor(udRootUrl: string) {
    this.udRootUrl = udRootUrl;
  }

  get userName(): ChainableElement {
    return cy.get('#page-container h2');
  }

  checkIsVisible(): void {
    cy.url().should('includes', `${this.udRootUrl}/history`);
  }

  /**
   * @todo change selector for traces because .m40 [class^=card]
   * Author: Nicolas legeay
   * Date: 14/09/21
   */
  get traces(): ChainableElement {
    return cy.get('.mt40 [class^=card]');
  }
}
