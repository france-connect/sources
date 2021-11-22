import {
  chooseIdpOnCore,
  checkInStringifiedJson,
  getAuthorizeUrl,
  getServiceProvider,
  setFSAuthorizeMethod,
  submitFSAuthorizeForm,
  setFSAuthorizeScope,
} from './mire.utils';

const BASIC_SUB =
  '9aeda75d9da1edba7051a7d16e413a72d5206f16cf68c5872dd4894558dde16a';

describe('Scope', () => {
  const { SP_ROOT_URL } = getServiceProvider(`${Cypress.env('SP_NAME')}1-low`);

  /**
   * @TODO #197 Implement tests once feature is implemented in `oidc-client`
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/197
   */
  it.skip('should return to the SP with an "invalid_scope" error if the query contains scopes that are not whitelisted for this SP', () => {
    // First visit SP home page to initialize its session.
    cy.visit(SP_ROOT_URL);

    // oidc param
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const url = getAuthorizeUrl({
      scope: 'openid profile',
    });

    // Visit forged /authorize URL
    cy.visit(url, {
      failOnStatusCode: false,
    });

    cy.url().should('match', new RegExp(`${SP_ROOT_URL}/error`));

    cy.get('#error-title').contains('invalid_scope');
    cy.get('#error-description').contains('requested scope is not whitelisted');
  });

  it('should send back all mandatory fields and all non mandatory created fields', () => {
    cy.visit(`${SP_ROOT_URL}`);

    setFSAuthorizeMethod('post');
    submitFSAuthorizeForm();
    chooseIdpOnCore('fia1-low');
    cy.get('button[type=submit]').click();

    checkInStringifiedJson('given_name', 'Angela Claire Louise'); // mandatory
    checkInStringifiedJson('usual_name', 'DUBOIS'); // mandatory
    checkInStringifiedJson('email', 'test@abcd.com'); // mandatory
    checkInStringifiedJson('siret', '34329377500037'); // not mandatory
    checkInStringifiedJson('siren', '343293775'); // not mandatory
    checkInStringifiedJson('sub', BASIC_SUB); // mandatory
    checkInStringifiedJson('organizational_unit', 'comptabilite'); // mandatory
    checkInStringifiedJson('belonging_population', 'agent'); // not mandatory
  });

  it('should work even if a non mandatory scope, not existing for the agent, is claimed', () => {
    cy.visit(`${SP_ROOT_URL}`);

    setFSAuthorizeMethod('post');
    submitFSAuthorizeForm();
    chooseIdpOnCore('fia1-low');
    cy.get('#login').clear().type('12551');
    cy.get('button[type=submit]').click();

    checkInStringifiedJson('given_name', 'Gils'); // mandatory
    checkInStringifiedJson('usual_name', 'Martinot'); // mandatory
    checkInStringifiedJson('email', 'test@abcd.com'); // mandatory
    checkInStringifiedJson(
      'sub',
      'af37dcbf9d81106b9a8731b284da17e56c075eeae5c5aa2fb8df76923010e9f0',
    ); // mandatory
    checkInStringifiedJson('belonging_population', undefined);
  });

  it('should not return optional claims not asked by scope', () => {
    cy.visit(`${SP_ROOT_URL}`);

    // No optional scopes
    const scopes = [
      'openid',
      'given_name',
      'usual_name',
      'email',
    ];
    setFSAuthorizeScope(scopes);

    setFSAuthorizeMethod('post');
    submitFSAuthorizeForm();
    chooseIdpOnCore('fia1-low');
    cy.get('button[type=submit]').click();

    checkInStringifiedJson('given_name', 'Angela Claire Louise'); // mandatory
    checkInStringifiedJson('usual_name', 'DUBOIS'); // mandatory
    checkInStringifiedJson('email', 'test@abcd.com'); // mandatory
    checkInStringifiedJson('sub', BASIC_SUB); // mandatory
    checkInStringifiedJson('organizational_unit', undefined); // mandatory
    checkInStringifiedJson('belonging_population', undefined);
    checkInStringifiedJson('siren', undefined); // not mandatory
    checkInStringifiedJson('siret', undefined); // not mandatory
  });

  it('should not return mandatory claims not asked by scope', () => {
    cy.visit(`${SP_ROOT_URL}`);

    // No email scope
    const scopes = [
      'openid',
      'given_name',
      'usual_name',
    ];
    setFSAuthorizeScope(scopes);

    setFSAuthorizeMethod('post');
    submitFSAuthorizeForm();
    chooseIdpOnCore('fia1-low');
    cy.get('button[type=submit]').click();

    checkInStringifiedJson('given_name', 'Angela Claire Louise'); // mandatory
    checkInStringifiedJson('usual_name', 'DUBOIS'); // mandatory
    checkInStringifiedJson('email', undefined); // mandatory
  });

  it('should send back right claims when you choose all scopes except aliases', () => {
    cy.visit(`${SP_ROOT_URL}`);

    // Disable aliases
    const scopes = [
      'openid',
      'given_name',
      'usual_name',
      'email',
    ];
    setFSAuthorizeScope(scopes);

    submitFSAuthorizeForm();
    chooseIdpOnCore('fia1-low');
    cy.get('button[type=submit]').click();

    checkInStringifiedJson('sub', BASIC_SUB);
    checkInStringifiedJson('given_name', 'Angela Claire Louise');
    checkInStringifiedJson('usual_name', 'DUBOIS');
    checkInStringifiedJson('email', 'test@abcd.com');
  });

  describe('discovery endpoint', () => {
    it('should not have "offline_access" in supported scopes', () => {
      cy.request(`${Cypress.env('FC_ROOT_URL')}${Cypress.env('WELL_KNOWN')}`)
        .its('body')
        .then((body) => body.scopes_supported)
        .should('not.include', 'offline_access');
    });

    it('should have a determined list of scopes in supported scopes', () => {
      cy.request(`${Cypress.env('FC_ROOT_URL')}${Cypress.env('WELL_KNOWN')}`)
        .its('body')
        .then((body) => body.scopes_supported)
        .should('include', 'openid')
        .and('include', 'given_name')
        .and('include', 'usual_name')
        .and('include', 'email')
        .and('include', 'siren')
        .and('include', 'siret')
        .and('include', 'organizational_unit')
        .and('include', 'belonging_population')
        .and('include', 'phone')
        .and('include', 'chorusdt');
    });
  });
});
