import {
  afterSuccessScenario,
  basicSuccessScenario,
  beforeSuccessScenario,
  checkInformations,
  checkInStringifiedJson,
  getAuthorizeUrl,
  getServiceProvider,
} from './mire.utils';

const BASIC_SUB =
  '9aeda75d9da1edba7051a7d16e413a72d5206f16cf68c5872dd4894558dde16a';
const FIA2_SUB = 
  '7ee46f66c58da6a0841e26aad127571d0c053a6b74673fe9112c6a9713ec36a9';

describe('Successful scenarios', () => {
  // -- replace by either `fip1-high` or `fia1-low`
  const idpId = `${Cypress.env('IDP_NAME')}1-low`;
  const idpId2 = `${Cypress.env('IDP_NAME')}2-low`;

  const mandatoryScopes = [
    "uid",
    "openid",
    "given_name",
    "email",
    "usual_name",
  ];

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
      eidasLevel: 1,
      idpId,
      password: '123',
      userName: 'test',
    };
    beforeSuccessScenario(params);
    basicSuccessScenario(idpId);
    afterSuccessScenario(params);

    checkInformations({
      givenName: 'Angela Claire Louise',
      usualName: 'DUBOIS',
    });
    checkInStringifiedJson('sub', BASIC_SUB);
  });

  // For tests purposes, fia2 is configured with an oidc callback having
  // providerUid as a parameter
  // @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/467
  it('should log in to Service Provider Example using legacyOidcCallback', () => {
    const params = {
      eidasLevel: 1,
      idpId: idpId2,
      password: '123',
      userName: 'test',
    };
    beforeSuccessScenario(params);
    basicSuccessScenario(idpId2);
    afterSuccessScenario(params);

    checkInformations({
      givenName: 'Angela Claire Louise',
      usualName: 'DUBOIS',
    });
    checkInStringifiedJson('sub', FIA2_SUB);
  });

  it('should log in to Service Provider Example with POST /authorize', () => {
    const params = {
      eidasLevel: 1,
      idpId,
      method: 'POST',
      password: '123',
      userName: 'test',
    };
    beforeSuccessScenario(params);
    basicSuccessScenario(idpId);
    afterSuccessScenario(params);

    checkInformations({
      givenName: 'Angela Claire Louise',
      usualName: 'DUBOIS',
    });
    checkInStringifiedJson('sub', BASIC_SUB);
  });

  it('should return to the SP with an "invalid_request" error if the query does not contain the "openid" scope', () => {
    const { SP_ROOT_URL } = getServiceProvider(`${Cypress.env('SP_NAME')}1-low`);
    // First visit SP home page to initialize its session.
    cy.visit(SP_ROOT_URL);
    const url = getAuthorizeUrl({
      scope: 'given_name',
    });

    // Visit forged /authorize URL
    cy.visit(url, {
      failOnStatusCode: false,
    });

    cy.url()
      .should('contains', `${SP_ROOT_URL}/error`)
      .should('contains', 'error=invalid_request')
      .should(
        'contains',
        'error_description=openid%20scope%20must%20be%20requested%20when%20using%20the%20acr_values',
      );
  });

  it('should log in to Service Provider Example with IDP ES256 signature', () => {
    const params = {
      eidasLevel: 1,
      idpId: 'fia1-low',
      password: '123',
      scopes: mandatoryScopes,
      sp: `${Cypress.env('SP_NAME')}4-low`,
      userName: 'test',
    };
    beforeSuccessScenario(params);
    basicSuccessScenario(params.idpId);
    afterSuccessScenario(params);

    checkInformations({
      givenName: 'Angela Claire Louise',
      usualName: 'DUBOIS',
    });
    checkInStringifiedJson(
      'sub',
      '890409e7e18d6a0f888864e79667c51a5d0431275b45fb587843227710d3df21',
    );
  });

  it('should log in to Service Provider Example with IDP HS256 signature', () => {
    const params = {
      eidasLevel: 1,
      idpId: 'fia4-low',
      password: '123',
      scopes: mandatoryScopes,
      sp: `${Cypress.env('SP_NAME')}4-low`,
      userName: 'test',
    };
    beforeSuccessScenario(params);
    basicSuccessScenario(params.idpId);
    afterSuccessScenario(params);

    checkInformations({
      givenName: 'Angela Claire Louise',
      usualName: 'DUBOIS',
    });
    checkInStringifiedJson(
      'sub',
      'b2f17952c6bcf540023532988374d12ca1a79559b298e9625fec8d93c85a5b2e',
    );
  });

  it('should log in to Service Provider Example with IDP RS256 signature', () => {
    const params = {
      eidasLevel: 1,
      idpId: 'fia5-low',
      password: '123',
      scopes: mandatoryScopes,
      sp: `${Cypress.env('SP_NAME')}4-low`,
      userName: 'test',
    };
    beforeSuccessScenario(params);
    basicSuccessScenario(params.idpId);
    afterSuccessScenario(params);

    checkInformations({
      givenName: 'Angela Claire Louise',
      usualName: 'DUBOIS',
    });
    checkInStringifiedJson(
      'sub',
      'e4acbd0edaf64d5a12e85586c91445b4ef5fbf1d744bdfc3ed46910b536d510c',
    );
  });
});
