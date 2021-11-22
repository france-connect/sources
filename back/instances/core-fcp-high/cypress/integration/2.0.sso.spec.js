import {
  basicScenario,
  basicSuccessScenario,
  checkInformationsServiceProvider,
} from './mire.utils';

describe('2.0 - No SSO', () => {
  // Given
  // -- replace by either `fip1-high` or `fia1-low`
  const idpId = `${Cypress.env('IDP_NAME')}1-high`;

  const loginInfo = {
    userName: 'test',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    acr_values: 'eidas2',
    idpId,
  };

  const userInfos = {
    gender: 'Femme',
    givenName: 'Angela Claire Louise',
    familyName: 'DUBOIS',
    birthdate: '1962-08-24',
    birthplace: '75107',
    birthcountry: '99100',
  };

  it('should require full cinematic to login another SP', () => {
    // When
    //   ...Log into SP "A"
    basicSuccessScenario(loginInfo);
    checkInformationsServiceProvider(userInfos);

    //   ...Then log  into SP "B"
    basicScenario({
      ...loginInfo,
      sp: 'SP2',
      scopes: ['openid','identite_pivot'],
    });
    cy.url().should('match', /\/api\/v2\/interaction\/[0-9a-z_-]+\/consent/i);
    cy.get('#consent').click();

    // Then
    checkInformationsServiceProvider(userInfos);
  });

  it('should run the whole cinematic all the times even for the same SP', () => {
    // When
    //   ...Log into SP
    basicSuccessScenario(loginInfo);
    checkInformationsServiceProvider(userInfos);
    //   ...Logout from SP
    cy.get('a.nav-logout').click();
    cy.contains(
      `Vous devez vous authentifier afin d'accéder à vos données personnelles.`,
    );
    //   ...Log again into SP
    basicSuccessScenario(loginInfo);

    // Then
    checkInformationsServiceProvider(userInfos);
  });
});
