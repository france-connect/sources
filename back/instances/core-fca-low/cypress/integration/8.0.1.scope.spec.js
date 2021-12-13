import {
  chooseIdpOnCore,
  checkInStringifiedJson,
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
