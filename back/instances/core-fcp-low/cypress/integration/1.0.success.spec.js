import {
  basicSuccessScenario,
  checkInformationsServiceProvider,
  checkInStringifiedJson,
} from './mire.utils';

describe('Successful scenarios', () => {
  const idpId = Cypress.env('IDP_NAME');

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

  it('should log in to Service Provider Example', () => {
    basicSuccessScenario({
      userName: 'test',
      password: '123',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas1',
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
  });
});
