import {
  basicSuccessScenario,
  checkInformationsServiceProvider,
  checkInStringifiedJson,
  logout,
} from './mire.utils';

describe('RP Initiated logout scenarios', () => {
  // -- replace by either `fip1-high` or `fia1-low`
  const idpId = `${Cypress.env('IDP_NAME')}1-high`;

  it('should log out from FC+ with post logout redirect uri', () => {
    basicSuccessScenario({
      userName: 'test',
      idpId,
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

    logout();

    cy.url().should('include', Cypress.env(`SP1_ROOT_URL`));
  });

  it('should log out from FC+ without post logout redirect uri', () => {
    const scopes = [
      'openid',
      'gender',
      'given_name',
      'family_name',
      'birth',
      'birthdate',
    ];
    basicSuccessScenario({
      userName: 'test',
      scopes,
      sp: 'SP2',
      idpId,
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

    logout();

    cy.url().should(
      'include',
      `${Cypress.env('FC_ROOT_URL')}/api/v2/session/end/success`,
    );
    cy.contains(
      'Vous êtes bien déconnecté, vous pouvez fermer votre navigateur.',
    );
  });
});
