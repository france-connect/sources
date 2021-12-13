import {
  afterSuccessScenario,
  basicSuccessScenario,
  beforeSuccessScenario,
  checkInformations,
  checkInStringifiedJson,
} from './mire.utils';

describe('Successful scenarios', () => {
  // -- replace by either `fip1-high` or `fia1-low`
  const sp1 = `${Cypress.env('SP_NAME')}1-low`;
  const sp2 = `${Cypress.env('SP_NAME')}2-low`;
  const idp1 = `${Cypress.env('IDP_NAME')}1-low`;
  const idp2 = `${Cypress.env('IDP_NAME')}2-low`;
  const idp4 = `${Cypress.env('IDP_NAME')}4-low`;

  // 4 different subs for the same agent
  const SUB_SP1_IDP1 = '9aeda75d9da1edba7051a7d16e413a72d5206f16cf68c5872dd4894558dde16a';
  const SUB_SP2_IDP1 = '85cd916363d19e8b77ea6e7caf7977381b8c5db6505195a5efd02d57e6087f3b';
  const SUB_SP1_IDP2 = '7ee46f66c58da6a0841e26aad127571d0c053a6b74673fe9112c6a9713ec36a9';
  const SUB_SP1_IDP4 = '85b099ff1b3eb74dba1faf2ab839819a5a326b29a3f113b580caf608199ae92e';

  it('should redirect to FC website', () => {
    cy.request({
      followRedirect: false,
      method: 'GET',
      url: `${Cypress.env('FC_ROOT_URL')}/api/v2`,
    }).then((response) => {
      expect(response.status).to.eq(301);
      expect(response.headers.location).to.eq('https://franceconnect.gouv.fr');
    });
  });

  it('should log in to Service Provider Example', () => {
    const params = {
      acrValues: 'eidas1',
      idpId: idp1,
      password: '123',
      sp: sp1,
      userName: 'test',
    };
    beforeSuccessScenario(params);
    basicSuccessScenario(idp1);
    afterSuccessScenario(params);

    checkInformations({
      givenName: 'Angela Claire Louise',
      usualName: 'DUBOIS',
    });
    checkInStringifiedJson('sub', SUB_SP1_IDP1);
  });

  // For tests purposes, fia2 is configured with an oidc callback having
  // providerUid as a parameter
  // @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/467
  it('should log in to Service Provider Example using legacyOidcCallback', () => {
    const params = {
      acrValues: 'eidas1',
      idpId: idp2,
      method: 'GET',
      password: '123',
      sp: sp1,
      userName: 'test',
    };
    beforeSuccessScenario(params);
    basicSuccessScenario(idp2);
    afterSuccessScenario(params);

    checkInformations({
      givenName: 'Angela Claire Louise',
      usualName: 'DUBOIS',
    });
    checkInStringifiedJson('sub', SUB_SP1_IDP2);
  });

  it('should log in to Service Provider Example with POST /authorize', () => {
    const params = {
      acrValues: 'eidas1',
      idpId: idp1,
      method: 'POST',
      password: '123',
      sp: sp1,
      userName: 'test',
    };
    beforeSuccessScenario(params);
    basicSuccessScenario(idp1);
    afterSuccessScenario(params);

    checkInformations({
      givenName: 'Angela Claire Louise',
      usualName: 'DUBOIS',
    });
    checkInStringifiedJson('sub', SUB_SP1_IDP1);
  });

  it('should use another sub when using another Servicer Provider', () => {
    const params = {
      acrValues: 'eidas1',
      idpId: idp1,
      method: 'GET',
      password: '123',
      sp: sp2,
      userName: 'test',
    };
    beforeSuccessScenario(params);
    basicSuccessScenario(idp1);
    afterSuccessScenario(params);

    checkInformations({
      givenName: 'Angela Claire Louise',
      usualName: 'DUBOIS',
    });
    checkInStringifiedJson('sub', SUB_SP2_IDP1);
  });

  it('should use another sub when using another Identity Provider', () => {
    const params = {
      acrValues: 'eidas1',
      idpId: idp4,
      method: 'GET',
      password: '123',
      sp: sp1,
      userName: 'test',
    };
    beforeSuccessScenario(params);
    basicSuccessScenario(idp4);
    afterSuccessScenario(params);

    checkInformations({
      givenName: 'Angela Claire Louise',
      usualName: 'DUBOIS',
    });
    checkInStringifiedJson('sub', SUB_SP1_IDP4);
  });
});
