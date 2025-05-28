import { ChainableElement } from '../types';

export default class FooterComponent {
  getFooterLinkByLabel(linkLabel: string): ChainableElement {
    return cy.contains('#footer .fr-footer__bottom-list li a', linkLabel);
  }
}
