import * as qs from 'querystring';

import {
  getIdentityProvider,
  setFSAuthorizeAcr,
  submitFSAuthorizeForm,
} from './mire.utils';

function getOidcCallbackUrl(idpInfo, event) {
  cy.request({
    url: `${idpInfo.IDP_ROOT_URL}/login`,
    method: 'POST',
    body: {
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
 * Run an interaction until the idp callback is triggered
 *
 * @param {Function} next a callback function that will receive `/oidc-callback` url as parameter.
 */
function prepareOidcCallbackAs(alias) {
  const idpId = `${Cypress.env('IDP_NAME')}1-high`;

  const idpInfo = getIdentityProvider(idpId);

  cy.visit(Cypress.env('SP1_ROOT_URL'));
  setFSAuthorizeAcr('eidas2');
  submitFSAuthorizeForm();
  cy.get(`#idp-${idpId}`).click();
  cy.url().should('contain', idpInfo.IDP_ROOT_URL);

  getOidcCallbackUrl(idpInfo, 'idp:step2');

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
  cy.visit(Cypress.env('SP1_ROOT_URL'));
  setFSAuthorizeAcr('eidas2');
  submitFSAuthorizeForm();
  cy.get(`#idp-${Cypress.env('IDP_NAME')}1-high`).click();

  // Use url from previous interaction
  cy.visit(attackerUrl, { failOnStatusCode: false });
  cy.hasError(`Y020022`);
}

describe('3.1 - OIDC Callback', () => {
  describe('3.1.1 - State verification', () => {
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

  describe('3.1.2 - Code verification', () => {
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
});
