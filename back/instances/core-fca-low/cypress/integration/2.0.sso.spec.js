import {beforeSuccessScenario, afterSuccessScenario, basicSuccessScenario, checkInformations } from './mire.utils';

describe('No SSO', () => {
  // Given
  // -- replace by either `fip1-high` or `fia1-low`
  const idpId = `${Cypress.env('IDP_NAME')}1-low`;

  const loginInfo = {
    acrValues: 'eidas1',
    userName: 'test',
    password: '123',
    idpId,
  };

  const userInfos = {
    givenName: 'Angela Claire Louise',
    usualName: 'DUBOIS',
  };
  it('should require full cinematic to login another SP', () => {
    // When
    //   ...Log into SP "A"
    //
    beforeSuccessScenario(loginInfo);
    basicSuccessScenario(loginInfo.idpId);
    afterSuccessScenario(loginInfo);

    checkInformations(userInfos);

    //   ...Then log  into SP "B"
    const params = {
      ...loginInfo,
      sp: `${Cypress.env('SP_NAME')}2-low`,
    };
    beforeSuccessScenario(params);
    basicSuccessScenario(params.idpId);
    afterSuccessScenario(params);

    // Then
    checkInformations(userInfos);
  });
  it('should run the whole cinematic all the times even for the same SP', () => {
    // When
    //   ...Log into SP
    beforeSuccessScenario(loginInfo);
    basicSuccessScenario(loginInfo.idpId);
    afterSuccessScenario(loginInfo);

    checkInformations(userInfos);
    //   ...Logout from SP
    cy.get('a.nav-logout').click();
    cy.contains(
      `Vous devez vous authentifier afin d'accéder à vos données personnelles.`,
    );

    //   ...Log again into SP
    beforeSuccessScenario(loginInfo);
    basicSuccessScenario(loginInfo.idpId);
    afterSuccessScenario(loginInfo);

    // Then
    checkInformations(userInfos);
  });
});
