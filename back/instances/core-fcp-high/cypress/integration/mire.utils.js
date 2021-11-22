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

export function setFSAuthorizeClaims(claims) {
  if (typeof claims !== 'string') {
    throw new Error('claims must be a string');
  }
  cy.get('#claims').clear().type(claims, {parseSpecialCharSequences: false});
}

export function submitFSAuthorizeForm() {
  cy.get('#call-authorize-button').click();
}

/**
 *
 * @param {*} params
 *
 * Available params :
 *  - acr_values
 *  - claims
 *  - method 'GET' or 'POST'
 *  - sp Name of the SP, possible values: SP1, SP2
 *  - scopes, array containing of scopes
 */
export function configureSpAndClickFc({
  acr_values: acrValues,
  claims,
  method = 'GET',
  sp = 'SP1',
  scopes,
}) {
  // FS choice
  cy.visit(`${Cypress.env('ALL_APPS_LISTED')}`);
  cy.url().should('include', `${Cypress.env('ALL_APPS_LISTED')}`);
  cy.get(Cypress.env(`${sp}_ID`)).click();

  setFSAuthorizeMethod(method);
  if (scopes) {
    setFSAuthorizeScope(scopes);
  }
  if (acrValues) {
    setFSAuthorizeAcr(acrValues);
  }
  if (claims) {
    setFSAuthorizeClaims(claims);
  }
  submitFSAuthorizeForm();
}

/**
 * @param params
 *
 * Available params :
 *  - acr_values
 *  - idpId
 *  - method 'GET' or 'POST'
 *  - userName
 *  - scopes Array of scopes
 *  - sp Name of the SP, possible values: SP1, SP2
 */
export function basicSuccessScenario(params) {
  cy.clearBusinessLog();

  const {
    acr_values: acrValues,
    idpId,
    userName,
    sp = 'SP1'
  } = params;
  const password = '123';
  const idpInfo = getIdentityProvider(idpId);

  const serviceProvider = {
    url: Cypress.env(`${sp}_ROOT_URL`),
    id: Cypress.env(`${sp}_CLIENT_ID`),
  };

  configureSpAndClickFc(params);

  // FC: choose FI
  cy.url().should(
    'include',
    `${Cypress.env('FC_ROOT_URL')}/api/v2/interaction`,
  );

  cy.hasBusinessLog({
    category: 'FRONT_CINEMATIC',
    event: 'FC_AUTHORIZE_INITIATED',
    spId: serviceProvider.id,
    spAcr: acrValues,
    idpId: null,
    idpName: null,
    idpAcr: null,
  });

  cy.hasBusinessLog({
    category: 'FRONT_CINEMATIC',
    event: 'FC_SHOWED_IDP_CHOICE',
    spId: serviceProvider.id,
    spAcr: acrValues,
    idpId: null,
    idpName: null,
    idpAcr: null,
  });

  cy.get(`#idp-${idpId}`).click();

  // FI: Authenticate
  cy.url().should('include', idpInfo.IDP_INTERACTION_URL);

  cy.hasBusinessLog({
    category: 'FRONT_CINEMATIC',
    event: 'IDP_CHOSEN',
    spId: serviceProvider.id,
    spAcr: acrValues,
    idpId, // idpId is set
    idpAcr: null, // idpAct is still null
  });

  cy.get('input[name="login"]').clear().type(userName);
  cy.get('input[name="password"]').clear().type(password);

  cy.get('[type="submit"]').click();

  // FC: Read confirmation message :D
  cy.url().should('match', /\/api\/v2\/interaction\/[0-9a-z_-]+\/consent/i);

  cy.hasBusinessLog({
    category: 'FRONT_CINEMATIC',
    event: 'FC_REQUESTED_IDP_TOKEN',
    spId: serviceProvider.id,
    spAcr: acrValues,
    idpId, // idpId is now set
    idpAcr: null, // idpAcr is still null
  });

  cy.hasBusinessLog({
    category: 'FRONT_CINEMATIC',
    event: 'FC_REQUESTED_IDP_USERINFO',
    spId: serviceProvider.id,
    spAcr: acrValues,
    idpId,
    idpAcr: null, // idpAcr is still null
  });

  cy.hasBusinessLog({
    category: 'FRONT_CINEMATIC',
    event: 'FC_REQUESTED_RNIPP',
    spId: serviceProvider.id,
    spAcr: acrValues,
    idpId,
    idpAcr: params.acr_values, // idpAcr is set
  });

  cy.hasBusinessLog({
    category: 'FRONT_CINEMATIC',
    event: 'FC_RECEIVED_VALID_RNIPP',
    spId: serviceProvider.id,
    spAcr: acrValues,
    idpId,
    idpAcr: acrValues,
  });

  cy.hasBusinessLog({
    category: 'FRONT_CINEMATIC',
    event: 'FC_VERIFIED',
    spId: serviceProvider.id,
    spAcr: acrValues,
    idpId,
    idpAcr: acrValues,
  });

  cy.hasBusinessLog({
    category: 'FRONT_CINEMATIC',
    event: 'FC_SHOWED_CONSENT',
    spId: serviceProvider.id,
    spAcr: acrValues,
    idpId,
    idpAcr: acrValues,
  });

  cy.get('#consent').click();

  cy.hasBusinessLog({
    category: 'FRONT_CINEMATIC',
    event: 'FC_REDIRECTED_TO_SP',
    spId: serviceProvider.id,
    spAcr: acrValues,
    idpId,
    idpAcr: acrValues,
  });

  cy.hasBusinessLog({
    category: 'BACK_CINEMATIC',
    event: 'SP_REQUESTED_FC_TOKEN',
    spId: serviceProvider.id,
    spAcr: acrValues,
    idpId,
    idpAcr: acrValues,
  });

  cy.hasBusinessLog({
    category: 'BACK_CINEMATIC',
    event: 'SP_REQUESTED_FC_USERINFO',
    spId: serviceProvider.id,
    spAcr: acrValues,
    idpId,
    idpAcr: acrValues,
  });
}

/**
 * Check whether the scopes are present in the consent page
 * @param {string[]} scopes array of scopes
 */
export function checkInformationsConsent(scopes) {
  const IDENTITY_SCOPES_LABEL = {
    // openid defined property names
    // eslint-disable-next-line @typescript-eslint/naming-convention
    family_name: `Nom de naissance`,
    gender: `Sexe`,
    // openid defined property names
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: `Prénom(s)`,
    // openid defined property names
    // eslint-disable-next-line @typescript-eslint/naming-convention
    preferred_username: `Nom d'usage`,
    birthdate: `Date de naissance`,
    birthplace: `Lieu de naissance`,
    birthcountry: `Pays de naissance`,
    address: `Adresse postale`,
    phone: `Téléphone`,
    email: `Adresse email`,
  };

  cy.get('#toggleOpenCloseMenu').click();

  scopes
    .filter((scope) => scope in IDENTITY_SCOPES_LABEL)
    .forEach((scope) =>
      cy.contains(IDENTITY_SCOPES_LABEL[scope]).should('exist'),
    );
}

export function checkInformationsServiceProvider(identity) {
  const {
    gender,
    givenName,
    familyName,
    preferredUsername = '/',
    birthdate,
    birthplace,
    birthcountry,
    amr,
  } = identity;

  cy.get('#html-output').within(() => {
    cy.contains(`Sexe : ${gender}`);
    cy.contains(`Prénom(s) : ${givenName}`);
    cy.contains(`Nom de naissance : ${familyName}`);
    cy.contains(`Nom d'usage : ${preferredUsername}`);
    cy.contains(`Date de naissance : ${birthdate}`);

    if (birthplace) {
      cy.contains(`COG (lieu de naissance) : ${birthplace}`);
    }

    if (birthcountry) {
      cy.contains(`COG (Pays de naissance) : ${birthcountry}`);
    }

    if (amr) {
      cy.contains(`AMR value : ${amr}`);
    }
  });
}

export function checkInStringifiedJson(key, value, selector = '#json-output') {
  cy.get(selector).then((elem) => {
    const txt = elem.text().trim();
    const data = JSON.parse(txt);

    if (value === undefined) {
      expect(data).not.to.have.property(key);
    } else {
      expect(data).to.have.property(key);
      expect(data[key]).to.deep.equal(value);
    }
  });
}

export function navigateToMire() {
  cy.visit(`${Cypress.env('SP1_ROOT_URL')}`);
  // Steal the state to finish the cinematic
  cy.get('input[name=state]')
    .invoke('val')
    .then((state) => {
      // Direct call to FC with custom params
      const controlUrl = getAuthorizeUrl({
        state,
      });
      cy.visit(controlUrl);
    });
}

export function validateConsent() {
  cy.url().should('match', /\/api\/v2\/interaction\/[0-9a-z_-]+\/consent/i);

  cy.get('#consent').click();
}

export function authenticateWithIdp(params = {}) {
  const { userName, password = '123', idpId = 'fip1-high' } = params;

  const { IDP_INTERACTION_URL } = getIdentityProvider(idpId);
  // FI: Authenticate
  cy.url().should('include', IDP_INTERACTION_URL);
  cy.get('input[name="login"]').clear().type(userName);
  cy.get('input[name="password"]').clear().type(password);

  // -- This section should be implemented in the IDP Mock instance
  // if (eidasLevel) {
  //   cy.get('select[name="acr"]').select(eidasLevel);
  // }
  // --

  cy.get('[type="submit"]').click();
}

/**
 * @param params
 *
 * Available params :
 *  - acr_values
 *  - claims
 *  - idpId
 *  - method 'GET' or 'POST'
 *  - userName
 *  - scopes Array of scopes
 *  - sp Name of the SP, possible values: SP1, SP2
 */
export function basicScenario(params) {
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    idpId,
    userName = 'test',
  } = params;
  const password = '123';

  const idpInfo = getIdentityProvider(idpId);

  configureSpAndClickFc(params);

  // FC: choose FI
  cy.url().should(
    'include',
    `${Cypress.env('FC_ROOT_URL')}/api/v2/interaction`,
  );
  cy.get(`#idp-${idpId}`).click();

  // FI: Authenticate
  cy.url().should('include', idpInfo.IDP_INTERACTION_URL);
  cy.get('input[name="login"]').clear().type(userName);
  cy.get('input[name="password"]').clear().type(password);

  cy.get('[type="submit"]').click();
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
  const baseAuthorizeUrl = '/api/v2/authorize';
  const baseAuthorizeParams = {
    // oidc param
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_id: `${Cypress.env('SP1_CLIENT_ID')}`,
    scope: 'openid gender family_name',
    // oidc param
    // eslint-disable-next-line @typescript-eslint/naming-convention
    response_type: 'code',
    // oidc param
    // eslint-disable-next-line @typescript-eslint/naming-convention
    redirect_uri: `${Cypress.env('SP1_ROOT_URL')}/oidc-callback`,
    state: 'stateTraces',
    // oidc param
    // eslint-disable-next-line @typescript-eslint/naming-convention
    acr_values: 'eidas3',
    nonce: 'nonceThatRespectsTheLengthWhichIsDefinedInTheDTOForKinematicWork',
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
 * Retrieve identity provider information.
 *
 * @param {string} idpId, Default: 'fip1-high'
 * @returns {Object} Ex: {
 *                     "ID": "fip1-high",
 *                     "IDP_ROOT_URL": "https://fip1-high.docker.dev-franceconnect.fr",
 *                     "IDP_INTERACTION_URL": "https://fip1-high.docker.dev-franceconnect.fr/interaction"
 *                   }
 */
export function getIdentityProvider(idpId = 'fip1-high') {
  return Cypress.env('IDP_AVAILABLES').find(({ ID }) => ID === idpId);
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
     * If fc+ envolves, you may need to update the index !
     */
    const endSessionUrlExpectedRedirectedUrl = redirectedUrls[6];
    expect(endSessionUrlExpectedRedirectedUrl).contain('/session/end');
    expect(endSessionUrlExpectedRedirectedUrl).contain('id_token_hint');
    expect(endSessionUrlExpectedRedirectedUrl).contain('state');
  });
}
