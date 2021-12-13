import * as QueryString from 'querystring';

export function setFSAuthorizeMethod(method) {
  if (typeof method !== 'string') {
    throw new Error('method must be a string');
  }
  const methodValue = method.toLowerCase() === 'post' ? 'post' : 'get';
  cy.get('#httpMethod').select(methodValue);
}

export function setFSAuthorizeScope(scopes) {
  if (!Array.isArray(scopes)) {
    throw new Error('scopes must be an Array');
  }
  const scopeValues = scopes.join(' ');
  cy.get('#scope').clear().type(scopeValues);
}

export function setFSAuthorizeAcr(acr) {
  if (typeof acr !== 'string') {
    throw new Error('acr must be a string');
  }
  cy.get('#acrValues').clear().type(acr);
}

export function submitFSAuthorizeForm() {
  cy.get('#call-authorize-button').click();
}

export function beforeSuccessScenario(params) {
  const { acrValues = 'eidas1', method, scopes, sp = 'fsa1-low' } = params;

  const { SP_CLIENT_ID, SP_ROOT_URL } = getServiceProvider(sp);
  // FS: Click on FC button
  cy.visit(SP_ROOT_URL);

  cy.clearBusinessLog();

  if (scopes) {
    setFSAuthorizeScope(scopes);
  }
  if (method) {
    setFSAuthorizeMethod(method);
  }
  submitFSAuthorizeForm();

  // FC: choose FI
  cy.url().should(
    'include',
    `${Cypress.env('FC_ROOT_URL')}/api/v2/interaction`,
  );

  cy.hasBusinessLog({
    category: 'FRONT_CINEMATIC',
    event: 'FC_AUTHORIZE_INITIATED',
    idpAcr: null,
    idpId: null,
    idpName: null,
    spAcr: acrValues,
    spId: SP_CLIENT_ID,
  });
  cy.hasBusinessLog({
    category: 'FRONT_CINEMATIC',
    event: 'FC_SHOWED_IDP_CHOICE',
    idpAcr: null,
    idpId: null,
    idpName: null,
    spAcr: acrValues,
    spId: SP_CLIENT_ID,
  });
}

/**
 * @param params
 *
 * Available params :
 *  - idpId
 *  - userName
 *  - password
 *  - sp Name of the SP, possible values: SP1, SP2
 *  - acr_values
 */
export function basicSuccessScenario(idpId) {
  chooseIdpOnCore(idpId);
}

export function afterSuccessScenario(params) {
  const { acrValues = 'eidas1', idpId, sp = 'fsa1-low', userName } = params;
  const password = params.password || '123';
  const { SP_CLIENT_ID } = getServiceProvider(sp);
  const { IDP_INTERACTION_URL } = getIdentityProvider(idpId);
  // FI: Authenticate
  cy.url().should('include', IDP_INTERACTION_URL);

  cy.hasBusinessLog({
    category: 'FRONT_CINEMATIC',
    event: 'IDP_CHOSEN',
    idpAcr: null, // idpAct is still null
    idpId, // idpId is set
    spAcr: acrValues,
    spId: SP_CLIENT_ID,
  });

  cy.get('input[name="login"]').clear().type(userName);
  cy.get('input[name="password"]').clear().type(password);
  cy.get('button[type="submit"]').click();

  cy.hasBusinessLog({
    category: 'FRONT_CINEMATIC',
    event: 'FC_REQUESTED_IDP_TOKEN',
    idpAcr: null, // idpAcr is still null
    idpId, // idpId is now set
    spAcr: acrValues,
    spId: SP_CLIENT_ID,
  });

  cy.hasBusinessLog({
    category: 'FRONT_CINEMATIC',
    event: 'FC_REQUESTED_IDP_USERINFO',
    idpAcr: null, // idpAcr is still null
    idpId,
    spAcr: acrValues,
    spId: SP_CLIENT_ID,
  });

  cy.hasBusinessLog({
    category: 'FRONT_CINEMATIC',
    event: 'FC_REDIRECTED_TO_SP',
    idpAcr: acrValues,
    idpId,
    spAcr: acrValues,
    spId: SP_CLIENT_ID,
  });

  cy.hasBusinessLog({
    category: 'BACK_CINEMATIC',
    event: 'SP_REQUESTED_FC_TOKEN',
    idpAcr: acrValues,
    idpId,
    spAcr: acrValues,
    spId: SP_CLIENT_ID,
  });

  cy.hasBusinessLog({
    category: 'BACK_CINEMATIC',
    event: 'SP_REQUESTED_FC_USERINFO',
    idpAcr: acrValues,
    idpId,
    spAcr: acrValues,
    spId: SP_CLIENT_ID,
  });
}

export function checkInformations(identity) {
  const { givenName, usualName } = identity;

  checkInStringifiedJson('given_name', givenName);
  checkInStringifiedJson('usual_name', usualName);
}

export function checkInStringifiedJson(key, value, selector = '#json') {
  cy.get(selector).then((elem) => {
    const txt = elem.text().trim();
    const data = JSON.parse(txt);

    if (value === undefined) {
      expect(data).not.to.have.property(key);
    } else {
      expect(data).to.have.property(key);
      expect(data[key]).to.eq(value);
    }
  });
}

export function chooseIdpOnCore(idpId) {
  const { ID, MINISTRY_NAME } = getIdentityProvider(idpId);
  cy.url().should(
    'include',
    `${Cypress.env('FC_ROOT_URL')}/api/v2/interaction`,
  );
  cy.get('#fi-search-term').type(MINISTRY_NAME);
  cy.get(`#idp-${ID}-button`).click();
}

/**
 * @param params
 *
 * Available params :
 *  - acrValues
 *  - idpAcr 
 *  - idpId
 *  - method
 *  - scope
 *  - sp Name of the SP, possible values: SP1, SP2
 *  - userName
 */
export function basicScenario(params) {
  const {
    acrValues,
    idpAcr,
    idpId,
    method = 'GET',
    scope,
    sp = 'fsa1-low',
    userName = 'test'
  } = params;
  const password = '123';
  const { IDP_INTERACTION_URL } = getIdentityProvider(idpId);
  const { SP_ROOT_URL } = getServiceProvider(sp);
  cy.visit(SP_ROOT_URL);

  setFSAuthorizeMethod(method);
  if (scope) {
    setFSAuthorizeScope(scope);
  }
  if (acrValues) {
    setFSAuthorizeAcr(acrValues);
  }
  submitFSAuthorizeForm();

  chooseIdpOnCore(idpId);

  // FI: Authenticate
  cy.url().should('include', IDP_INTERACTION_URL);
  cy.get('input[name="login"]').clear().type(userName);
  cy.get('input[name="password"]').clear().type(password);

  if (idpAcr) {
    cy.get('input[name="acr"]').clear().type(idpAcr);
  }

  cy.get('button[type="submit"]').click();
}

export function basicErrorScenario(params) {
  const { errorCode } = params;
  Reflect.deleteProperty(params, 'errorCode');
  basicScenario({
    ...params,
    userName: errorCode,
  });
}

export function getAuthorizeUrl(overrideParams = {}, removeParams = []) {
  const { SP_CLIENT_ID, SP_ROOT_URL } = getServiceProvider('fsa1-low');
  const baseAuthorizeUrl = '/api/v2/authorize';
  const baseAuthorizeParams = {
    // oidc param
    // eslint-disable-next-line @typescript-eslint/naming-convention
    acr_values: 'eidas1',
    // oidc param
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_id: `${SP_CLIENT_ID}`,
    nonce: 'nonceThatRespectsTheLengthWhichIsDefinedInTheDTOForKinematicWork',
    // oidc param
    // eslint-disable-next-line @typescript-eslint/naming-convention
    redirect_uri: `${SP_ROOT_URL}/oidc-callback`,
    // oidc param
    // eslint-disable-next-line @typescript-eslint/naming-convention
    response_type: 'code',
    scope: 'openid gender family_name',
    state: 'stateTraces',
  };
  const params = {
    ...baseAuthorizeParams,
    ...overrideParams,
  };

  if (removeParams) {
    const paramsToKill = Array.isArray(removeParams)
      ? removeParams
      : [removeParams];
    paramsToKill.forEach((deadParam) =>
      Reflect.deleteProperty(params, deadParam),
    );
  }

  return `${baseAuthorizeUrl}?${QueryString.stringify(params)}`;
}

/**
 * Retrieve service provider information
 * @param {*} sp : service provider identifier
 */
export function getServiceProvider(sp = 'fsa1-low') {
  return Cypress.env('SP_AVAILABLES').find(({ ID }) => ID === sp);
}

/**
 * Retrieve service provider information
 * @param {*} idp : identity provider uid
 */
export function getIdentityProvider(idp = 'fia1-low') {
  return Cypress.env('IDP_AVAILABLES').find(({ ID }) => ID === idp);
}

export function logout() {
  const redirectedUrls = [];

  cy.on('url:changed', (url) => {
    redirectedUrls.push(url);
  });

  cy.get('a.nav-link.nav-logout').click();

  cy.then(() => {
    /**
     * Since "url:changed" capture all redirected URLs and we want to check only one,
     * we hard set the place in the array.
     * If ac envolves, you may need to update the index !
     */
    const endSessionUrlExpectedRedirectedUrl = redirectedUrls[4];
    expect(endSessionUrlExpectedRedirectedUrl).contain('/session/end');
    expect(endSessionUrlExpectedRedirectedUrl).contain('id_token_hint');
    expect(endSessionUrlExpectedRedirectedUrl).contain('state');
  });
}
