import {
  checkInStringifiedJson,
  chooseIdpOnCore,
  getServiceProvider,
  setFSAuthorizeMethod,
  submitFSAuthorizeForm,
} from './mire.utils';

describe('Scope', () => {
  const { SP_ROOT_URL } = getServiceProvider(`${Cypress.env('SP_NAME')}1-low`);

  it('should work even if a non mandatory scope, not existing for the agent, is claimed', () => {
    cy.visit(`${SP_ROOT_URL}`);

    setFSAuthorizeMethod('post');
    submitFSAuthorizeForm();
    chooseIdpOnCore('9c716f61-b8a1-435c-a407-ef4d677ec270');
    cy.get('#login').clear().type('12551');
    cy.get('button[type=submit]').click();

    checkInStringifiedJson('given_name', 'Gils'); // mandatory
    checkInStringifiedJson('usual_name', 'Martinot'); // mandatory
    checkInStringifiedJson('email', 'test@abcd.com'); // mandatory
    checkInStringifiedJson(
      'sub',
      '70ae1aef90b7c4936b3b7b739d4245a1f1cb91ad61bc826f74786b47085eddbc',
    ); // mandatory
    checkInStringifiedJson('belonging_population', undefined);
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
