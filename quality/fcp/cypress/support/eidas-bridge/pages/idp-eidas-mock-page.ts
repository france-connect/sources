import { EidasAssuranceLevelEnum, EuIdpLoginCancelStepEnum } from '../enums';

interface IdpEidasMockLoginInterface {
  username?: string;
  password?: string;
  loa?: EidasAssuranceLevelEnum;
  cancel?: EuIdpLoginCancelStepEnum;
}

export default class IdpEidasMockPage {
  authenticateToEUIdp(params: IdpEidasMockLoginInterface = {}): void {
    const {
      cancel,
      loa = EidasAssuranceLevelEnum.D,
      password = 'creus',
      username = 'xavi',
    } = params;

    if (cancel === EuIdpLoginCancelStepEnum.MandatoryAttributes) {
      cy.get('#buttonCancelSlide1').click();
      return;
    }

    cy.get('#buttonNextSlide1').click();

    if (cancel === EuIdpLoginCancelStepEnum.OptionalAttributes) {
      cy.get('#buttonCancelSlide2').click();
      return;
    }

    // Add all optional claims present
    cy.get('span.switchery').click({ multiple: true });

    cy.get('#buttonNextSlide2').click();

    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.get('#eidasloa').select(EidasAssuranceLevelEnum[loa]);

    // turn off uncaught:exception handling on idp eidas mock
    // because of error `decodeCurrentAddress is not defined`
    Cypress.on('uncaught:exception', (_err, _runnable) => {
      return false;
    });
    cy.get('#idpSubmitbutton').click();

    if (cancel === EuIdpLoginCancelStepEnum.Confirmation) {
      cy.get('#buttonCancel').click();
    } else {
      cy.get('#buttonNext').click();
    }

    Cypress.on('uncaught:exception', (_err, _runnable) => {
      return true;
    });
  }
}
