import url from 'url';

function interceptAuthorizeToCheckParams() {
  /**
   * The "?" is necessary because otherwise cypress match a curious who only
   * exists in its environment :
   * ${Cypress.env('CORE_ROOT_URL')}/api/v2/authorize/:uid
   */
  cy.intercept(`${Cypress.env('CORE_ROOT_URL')}/api/v2/authorize?*`).as(
    'authorizeQuery',
  );
}

function connectToFcIdp(fcRequest) {
  const { idpId, login = 'test', password = '123' } = fcRequest;

  // FC: choose FI
  cy.url().should(
    'include',
    `${Cypress.env('CORE_ROOT_URL')}/api/v2/interaction`,
  );
  cy.get(`#idp-${idpId}`).click();

  // FI: Authenticate
  cy.url().should(
    'include',
    `${Cypress.env('IDP_ROOT_URL').replace('IDP_NAME', idpId)}/interaction`,
  );
  cy.get('input[name="login"]').clear().type(login);
  cy.get('input[name="password"]').clear().type(password);

  cy.get('button[type="submit"]').click();

  cy.get('#consent').click();
}

/**
 * @todo #488 rename and refacto to use it as a autonomous function (navigateToMireFromFR)
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/488
 */
export function configureEidasSpMockRequest(eidasRequest = {}) {
  const request = {
    nameId: 'unspecified',
    loa: 'E',
    loaCompareType: 'minimum',
    spType: 'public',
    naturalPersonAttributes: [
      // Type = Mandatory / Optional / NoRequest
      { name: 'BirthName', type: 'Mandatory' },
      { name: 'FamilyName', type: 'Mandatory' },
      { name: 'FirstName', type: 'Mandatory' },
      { name: 'DateOfBirth', type: 'Mandatory' },
      { name: 'PersonIdentifier', type: 'Mandatory' },
      { name: 'Gender', type: 'Mandatory' },
      { name: 'PlaceOfBirth', type: 'Mandatory' },
    ],
    ...eidasRequest,
  };

  cy.visit(Cypress.env('MOCK_EIDAS_SP_URL'));

  cy.get('#eidasconnector_msdd').click();
  cy.get('#eidasconnector_msdd .enabled._msddli_').contains('CB').click();

  cy.get('#citizeneidas_msdd').click();
  cy.get('#citizeneidas_msdd .enabled._msddli_').contains('FR').click();

  cy.get('#eidasNameIdentifier').select(request.nameId);
  cy.get('#eidasloa').select(request.loa);
  cy.get('#eidasloaCompareType').select(request.loaCompareType);
  cy.get('#eidasSPType').select(request.spType);

  cy.get('#check_all_NoRequestEidas').click();
  cy.get('#tab2_toggle1').click();

  request.naturalPersonAttributes.forEach(({ name, type }) => {
    cy.get(`#${type}_${name}Eidas`).click();
  });

  // Submit configuration
  cy.get('#submit_tab2').click();

  // We need to remove the target "_parent" from the form to run cypress tests that are a frame
  cy.get('#countrySelector').invoke('removeAttr', 'target');

  // Submit request
  cy.get('#submit_saml').click();
}

/**
 * @param params
 * Available params :
 *  - eidasRequest
 *    + see the function "configureEidasSpMockRequest"
 *  - LogWith
 *    + idpId
 *    + username
 *    + password
 */
export function basicSuccessScenarioEuSpFrIdp(params) {
  const { eidasRequest, logWith } = params;

  interceptAuthorizeToCheckParams();
  configureEidasSpMockRequest(eidasRequest);
  connectToFcIdp(logWith);

  // We need to remove the target "_parent" from the form to run cypress tests that are a frame
  // Yes, the id does not match the page, tell that to eIDAS devs :p
  cy.get('#countrySelector').invoke('removeAttr', 'target');

  // Submit response
  cy.get('#submit_saml').click();
}

export function checkInformationsEuSpFrIdp(params = {}) {
  const {
    expectedAuthorize = {
      scope:
        'openid family_name preferred_username given_name birthdate gender birthplace birthcountry',
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas3',
    },
    expectedIdentity = [
      { name: 'BirthName', value: '[DUBOIS]' },
      { name: 'FamilyName', value: '[DUBOIS]' },
      { name: 'FirstName', value: '[Claire, Angela, Louise]' },
      { name: 'DateOfBirth', value: '[1962-08-24]' },
      { name: 'Gender', value: '[Female]' },
      {
        name: 'PersonIdentifier',
        value:
          '[FR/UK/082aef8c0d31e99d83d910879a4fcdd8610d571f07ce5610440b3a0161f6e393v1]',
      },
      {
        name: 'PlaceOfBirth',
        value: '[Paris 7e Arrondissement - 75107, FRANCE (FR)]',
      },
    ],
  } = params;

  cy.wait('@authorizeQuery').then(({ request }) => {
    const { query } = url.parse(request.url, { parseQueryString: true });
    expect(query).to.include(expectedAuthorize);
  });

  expectedIdentity.forEach(({ name, value }) => {
    cy.get('table.table-striped')
      .contains(name)
      .parent('tr')
      .within(() => {
        cy.get('td').eq(0).contains(name);
        cy.get('td').eq(1).contains(value);
      });
  });
}

export function setFSAuthorizeMethod(method) {
  if (typeof method !== 'string') {
    throw new Error('method must be a string');
  }
  const methodValue = method.toLowerCase() === 'post' ? 'post' : 'get';
  cy.get('#httpMethod').select(methodValue);
}

export function submitFSAuthorizeForm() {
  cy.get('#call-authorize-button').click();
}

/**
 * @todo #488 rename and refacto to use it as a autonomous function (navigateToMireFromFR)
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/488
 */
export function configureOidcSpMockRequest(params = {}) {
  const idpId = 'eidas-bridge';
  const { sp = 'SP1', method = 'GET' } = params;

  const serviceProvider = {
    url: Cypress.env(`${sp}_ROOT_URL`),
    id: Cypress.env(`${sp}_CLIENT_ID`),
  };
  cy.clearBusinessLog();

  // FS: Click on FC button
  cy.visit(serviceProvider.url);

  setFSAuthorizeMethod(method);
  submitFSAuthorizeForm()

  // FC: choose FI

  cy.url().should(
    'include',
    `${Cypress.env('CORE_ROOT_URL')}/api/v2/interaction`,
  );

  cy.hasBusinessLog({
    category: 'FRONT_CINEMATIC',
    event: 'FC_AUTHORIZE_INITIATED',
    spId: serviceProvider.id,
    spAcr: params.acr_values,
    idpId: null,
    idpName: null,
    idpAcr: null,
  });
  cy.hasBusinessLog({
    category: 'FRONT_CINEMATIC',
    event: 'FC_SHOWED_IDP_CHOICE',
    spId: serviceProvider.id,
    spAcr: params.acr_values,
    idpId: null,
    idpName: null,
    idpAcr: null,
  });
  cy.get(`#idp-${idpId}`).click();

  // FI: Authenticate
  cy.url().should('include', `${Cypress.env('BRIDGE_ROOT_URL')}/interaction/`);

  cy.hasBusinessLog({
    category: 'FRONT_CINEMATIC',
    event: 'IDP_CHOSEN',
    spId: serviceProvider.id,
    spAcr: params.acr_values,
    idpId, // idpId is set
    idpAcr: null, // idpAct is still null
  });

  cy.get('#country-CB').click();
}

export function basicSuccessScenarioFrSpEuIdp(params = {}) {
  configureOidcSpMockRequest(params);

  const { username = 'xavi', password = 'creus', loa = 'E' } = params;

  cy.get('#buttonNextSlide1').click();

  cy.get('ul.toogle-switch').within(() => {
    cy.get('li span').eq(0).click();
    cy.get('li span').eq(1).click();
  });

  cy.get('#buttonNextSlide2').click();

  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('#eidasloa').select(loa);

  cy.get('#idpSubmitbutton').click();
  cy.get('#buttonNext').click();

  cy.get('#consent').click();
}

export function basicFailureScenarioFrSpEuIdp(params = {}) {
  configureOidcSpMockRequest(params);
  authenticateToEUIdp(params);
}
/**
 * handle the authentification in the EU idp
 * @param {*} params
 * @returns
 */
// Nécessaire pour le processus
// eslint-disable-next-line complexity
export function authenticateToEUIdp(params = {}) {
  const {
    username = 'xavi',
    password = 'creus',
    loa = 'E',
    cancel,
    optionalAttributes = true,
  } = params;

  if (cancel === 'mandatory_attributes') {
    return cy.get('#buttonCancelSlide1').click();
  }

  cy.get('#buttonNextSlide1').click();

  if (cancel === 'optional_attributes') {
    return cy.get('#buttonCancelSlide2').click();
  }

  // depends on the list of the scopes requested
  if (optionalAttributes) {
    cy.get('ul.toogle-switch').within(() => {
      cy.get('li span').eq(0).click();
      cy.get('li span').eq(1).click();
    });
  }

  cy.get('#buttonNextSlide2').click();

  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('#eidasloa').select(loa);

  cy.get('#idpSubmitbutton').click();

  if (cancel === 'confirmation') {
    return cy.get('#buttonCancel').click();
  }
  cy.get('#buttonNext').click();
}

export function checkInformationsFrSpEuIdp() {
  cy.get('#json-output').within(() => {
    cy.contains(
      '"sub": "cfc7065e4090d3df35fd72caaee82bc68ad8711f2c2e30b0c9d2f1f0eb7eadc1v1"',
    );
    cy.contains('"given_name": "javier"');
    cy.contains('"family_name": "Garcia"');
    cy.contains('"birthdate": "1964-12-31"');
    cy.contains('"gender": "male"');
    cy.contains('"birthplace": "Place of Birth"');
    cy.contains(
      '"iss": "https://core-fcp-high.docker.dev-franceconnect.fr/api/v2"',
    );
  });

  cy.get('#html-output').within(() => {
    cy.contains('AMR value : eidas');
  });
}

/**
 * select the correct idp on Mire
 * @param {*} params
 */
export function chooseIdp(params = {}) {
  const { idpId = `${Cypress.env('IDP_NAME')}1-high` } = params;
  cy.url().should(
    'include',
    `${Cypress.env('CORE_ROOT_URL')}/api/v2/interaction`,
  );
  cy.get(`#idp-${idpId}`).click();
}

/**
 *
 * @param {*} params
 */
export function authenticateToIdp(params = {}) {
  const { login = 'test', eidasLevel, password = '123' } = params;

  const baseUrl = Cypress.env('IDP_ROOT_URL').replace(
    'IDP_NAME',
    `${Cypress.env('IDP_NAME')}1-high`,
  );

  cy.url().should('include', `${baseUrl}/interaction`);
  cy.get('input[name="login"]').clear().type(login);
  cy.get('input[name="password"]').clear().type(password);

  if (eidasLevel) {
    cy.get('select[name="acr"]').select(eidasLevel);
  }

  cy.get('button[type="submit"]').click();
}
