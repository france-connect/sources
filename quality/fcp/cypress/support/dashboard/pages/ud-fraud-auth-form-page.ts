import { ChainableElement } from '../../common/types';
import { FraudFormValues } from '../../common/types/fraud-form-values';
import UdFraudFormPage from './ud-fraud-form-page';

export default class UdFraudAuthFormPage extends UdFraudFormPage {
  udRootUrl: string;

  constructor(udRootUrl: string) {
    super();
    this.udRootUrl = udRootUrl;
  }

  checkHasFraudSurveyOriginQueryParam(fraudSurveyOrigin: string): void {
    cy.url().should('include', `?fraudSurveyOrigin=${fraudSurveyOrigin}`);
  }

  checkIsVisible(): void {
    const formUrl = `${this.udRootUrl}/fraud/form`;
    cy.url().should('include', formUrl);
  }

  fillDefaultValues(values: FraudFormValues): void {
    super.fillDefaultValues(values);
  }

  getConsentCheckbox(): ChainableElement {
    return cy.get('[name=acceptTransmitData]');
  }

  getHistoryLink(): ChainableElement {
    return cy.get('[data-testid="history-link"]');
  }

  getFraudSurveyButton(): ChainableElement {
    return cy.get('[data-testid="fraud-survey-button"]');
  }
}
