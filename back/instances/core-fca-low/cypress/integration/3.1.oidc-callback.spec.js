import * as qs from 'querystring';
import {
  chooseIdpOnCore,
  getServiceProvider,
  getIdentityProvider,
  submitFSAuthorizeForm
} from './mire.utils';

function getOidcCallbackUrl(interactionId, event) {
  const { IDP_ROOT_URL } = getIdentityProvider(`${Cypress.env('IDP_NAME')}1-low`);

  cy.request({
    url: `${IDP_ROOT_URL}/login`,
    method: 'POST',
    body: {
      interactionId,
      login: 'test',
      password: '123',
      acr: 'eidas2',
    },
    form: true,
    followRedirect: false,
  }).as('idp:step1');

  cy.get('@idp:step1').then((response) => {
    cy.request({
      url: response.headers.location,
      followRedirect: false,
    }).as(event);
  });
}

/**
 * InteractionId is the last and only path part.
 * It might be folowwed by a question mark.
 * @param {string} url
 * @return {string}
 */
function extractInteractionIdFromUrl(url) {
  return url.split('/').pop().replace('?', '');
}

/**
 * Run an interaction until the idp callback is triggered
 *
 * @param {Function} next a callback function that will receive `/oidc-callback` url as parameter.
 */
function prepareOidcCallbackAs(alias) {
  const { SP_ROOT_URL } = getServiceProvider(`${Cypress.env('SP_NAME')}1-low`);
  const { IDP_ROOT_URL } = getIdentityProvider(`${Cypress.env('IDP_NAME')}1-low`);

  cy.visit(SP_ROOT_URL);
  submitFSAuthorizeForm();
  
  chooseIdpOnCore(`${Cypress.env('IDP_NAME')}1-low`);

  cy.url().should('contain', IDP_ROOT_URL);

  cy.url().then((url) => {
    const interactionId = extractInteractionIdFromUrl(url);
    getOidcCallbackUrl(interactionId, 'idp:step2');
  });

  cy.get('@idp:step2')
    .then((response) => response.headers.location)
    .as(alias);
}
/**
 * Replace parameter from provided URL, visit it, assert content
 *
 * Beware of the currying! This function actually returns another function
 * that will receive an oidc-callback url as only parameter.
 */
const finishWithReplacedParam = (param, replacement, exepectedErrorCode) => (
  url,
) => {
  const [host, queryString] = url.split('?');
  const params = qs.parse(queryString);
  params[param] = replacement;
  const replacedQueryString = qs.stringify(params);

  cy.visit(`${host}?${replacedQueryString}`, { failOnStatusCode: false });
  cy.hasError(exepectedErrorCode);
};

/**
 * Instead of altering /oidc-callback URL and visiting it,
 * we create a second interaction and use callback url from the first one.
 */
function finishWithReplacedUrl(attackerUrl) {
  // Start a new session by emtying cookies
  cy.clearCookies();
  // Start a new interaction
  const { SP_ROOT_URL } = getServiceProvider(`${Cypress.env('SP_NAME')}1-low`);
  cy.visit(SP_ROOT_URL);
  submitFSAuthorizeForm();
  
  chooseIdpOnCore(`${Cypress.env('IDP_NAME')}1-low`);

  // Use url from previous interaction
  cy.visit(attackerUrl, { failOnStatusCode: false });
  cy.hasError(`Y020022`);
}

describe('State verification', () => {
  it('should not allow /oidc-callback with forged state param', () => {
    prepareOidcCallbackAs('oidcCallback');

    cy.get('@oidcCallback').then(
      finishWithReplacedParam('state', 'forgedState', 'Y020022'),
    );
  });

  it('should not allow /oidc-callback from another interaction', () => {
    prepareOidcCallbackAs('oidcCallback');

    cy.get('@oidcCallback').then(finishWithReplacedUrl);
  });

  it('should not allow /oidc-callback without state param', () => {
    prepareOidcCallbackAs('oidcCallback');

    cy.get('@oidcCallback').then(
      finishWithReplacedParam('state', null, 'Y020021'),
    );
  });

  it('should not allow /oidc-callback with empty state param', () => {
    prepareOidcCallbackAs('oidcCallback');

    cy.get('@oidcCallback').then(
      finishWithReplacedParam('state', '', 'Y020021'),
    );
  });
});

describe('Code verification', () => {
  it('should not allow /oidc-callback without code param', () => {
    prepareOidcCallbackAs('oidcCallback');

    cy.get('@oidcCallback').then(
      finishWithReplacedParam('code', null, 'Y020025'),
    );
  });

  it('should not allow /oidc-callback with empty code param', () => {
    prepareOidcCallbackAs('oidcCallback');

    cy.get('@oidcCallback').then(
      finishWithReplacedParam('code', '', 'Y020025'),
    );
  });
});
