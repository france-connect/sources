import {
  basicSuccessScenario,
  checkInformationsServiceProvider,
  checkInStringifiedJson,
  getAuthorizeUrl,
  navigateToMire,
} from './mire.utils';

describe('1.0 - Successful scenarios', () => {
  // -- replace by either `fip1-high` or `fia1-high`
  const idpId = `${Cypress.env('IDP_NAME')}1-high`;
  const idpId2 = `${Cypress.env('IDP_NAME')}2-high`;

  // For tests purposes, fip2 is configured with an oidc callback having
  // providerUid as a parameter
  // @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/467
  it('should log in to Service Provider Example using legacyOidcCallback', () => {
    basicSuccessScenario({
      userName: 'test',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      idpId: idpId2,
      accountId: '3ec64565-a907-4284-935a-0ff0213cc120',
      idpSub:
        '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    });

    checkInformationsServiceProvider({
      gender: 'Femme',
      givenName: 'Angela Claire Louise',
      familyName: 'DUBOIS',
      birthdate: '1962-08-24',
      birthplace: '75107',
      birthcountry: '99100',
    });
    checkInStringifiedJson(
      'sub',
      '4d327dd1e427daf4d50296ab71d6f3fc82ccc40742943521d42cb2bae4df41afv1',
    );
  });
  it('should redirect to FC website', () => {
    cy.request({
      url: `${Cypress.env('FC_ROOT_URL')}/api/v2`,
      method: 'GET',
      followRedirect: false,
    }).then((response) => {
      expect(response.status).to.eq(301);
      expect(response.headers.location).to.eq('https://franceconnect.gouv.fr');
    });
  });

  it('should navigate by tab and enter on menu link', () => {
    const url = getAuthorizeUrl();
    cy.visit(url);

    cy.get('body').tab();
    cy.focused().invoke('attr', 'href');

    //TODO: find how trigger a keypress on key enter instead
    //After many tests a key press on this keys it seems that it implicitly triggers a click on the focus element
    cy.focused().click();
    cy.url().should(
      'contains',
      '/error?error=access_denied&error_description=User%20auth%20aborted&state=stateTraces',
    );

    cy.get('#error-title').contains('Error: access_denied');
    cy.get('#error-description').contains('User auth aborted');
  });

  it('should apply box shadow when identity provider links are focused', () => {
    navigateToMire();
    cy.get('#idp-list form').each((item) => {
      cy.get(item)
        .find('div button')
        .invoke('attr', 'disabled')
        .then((isDisabled) => {
          if (!isDisabled) {
            cy.get(item).find('div button').focus();
            cy.get(item).find('div button').should('have.css', 'box-shadow');
            cy.get(item).find('div button').blur();
          }
        });
    });
  });

  describe('Send notification email on a successfull scenario', () => {
    beforeEach(() => {
      cy.resetTechnicalLog();
    });

    it('should log in to Service Provider Example and check notification email is sent', () => {
      basicSuccessScenario({
        userName: 'test',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'eidas2',
        idpId,
        accountId: '3ec64565-a907-4284-935a-0ff0213cc120',
      });

      checkInformationsServiceProvider({
        gender: 'Femme',
        givenName: 'Angela Claire Louise',
        familyName: 'DUBOIS',
        birthdate: '1962-08-24',
        birthplace: '75107',
        birthcountry: '99100',
      });
      checkInStringifiedJson(
        'sub',
        '4d327dd1e427daf4d50296ab71d6f3fc82ccc40742943521d42cb2bae4df41afv1',
      );
      cy.verifyEmailIsSent('Notification de connexion à FranceConnect+');
    });
  });
});
