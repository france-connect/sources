import { ChainableElement } from '../../common/types';

export default class UdFraudLoginPage {
  udFraudRootUrl: string;

  constructor(udFraudRootUrl: string) {
    this.udFraudRootUrl = udFraudRootUrl;
  }

  getExpiredSessionAlert(): ChainableElement {
    return cy.get('[data-testid="AlertComponent-session-expired-alert"]');
  }

  getAuthorizeButton(): ChainableElement {
    return cy.get('button[type="submit"]');
  }

  getIdentifyTheftReportLink(): ChainableElement {
    return cy.get('[data-testid="fraud-identity-theft-report-link"]');
  }

  getFraudSupportFormHelpAccordionToggle(): ChainableElement {
    return cy.get('[data-testid="AccordionComponent-fraud-login-accordion"]');
  }

  checkIsVisible(): void {
    cy.url().should('include', this.udFraudRootUrl);
    this.getFraudSupportFormHelpAccordionToggle().should('be.visible');
    this.getAuthorizeButton().should('be.visible');
  }

  checkIsExpiredSessionAlertDisplayed(displayed: boolean): void {
    if (displayed) {
      cy.contains(
        '[data-testid="AlertComponent-session-expired-alert"]',
        'Votre session a expiré, veuillez vous reconnecter.',
      );
    } else {
      this.getExpiredSessionAlert().should('not.exist');
    }
  }
}
