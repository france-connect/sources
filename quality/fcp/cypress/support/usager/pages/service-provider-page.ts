import {
  ChainableElement,
  ScopeContext,
  ServiceProviderBase,
  UserClaims,
} from '../../common/types';

export default class ServiceProviderPage {
  clientId: string;
  fcButtonSelector: string;
  logoutButtonSelector: string;
  mocked: boolean;
  originUrl: string;
  redirectUri: string;

  constructor(args: ServiceProviderBase) {
    const {
      clientId,
      mocked,
      redirectUri,
      selectors: { fcButton, logoutButton },
      url,
    } = args;
    this.clientId = clientId;
    this.fcButtonSelector = fcButton;
    this.logoutButtonSelector = logoutButton;
    this.mocked = mocked;
    this.originUrl = url;
    this.redirectUri = redirectUri;
  }

  isLegacySPMock(): boolean {
    // Only Legacy SP mocks have clientId and redirectUri in the fixtures
    return this.mocked && !!this.clientId && !!this.redirectUri;
  }

  getFcButton(): ChainableElement {
    return cy.get(this.fcButtonSelector);
  }

  getRevokeTokenButton(): ChainableElement {
    return cy.get('#revoke-token');
  }

  getTokenRevokationConfirmation(): ChainableElement {
    return cy.contains('h1', 'Le token a été révoqué');
  }

  getLogoutButton(): ChainableElement {
    return cy.get(this.logoutButtonSelector);
  }

  getUserInfoButton(): ChainableElement {
    return cy.get('#reload-userinfo');
  }

  getDataButton(): ChainableElement {
    return cy.get('[data-testid="get-data-link"]');
  }

  checkIsVisible(): void {
    cy.url().should('include', this.originUrl);
  }

  checkIsUserConnected(isConnected = true): void {
    const state = isConnected ? 'be.visible' : 'not.exist';
    this.getLogoutButton().should(state);
  }

  // Initiate FC connection using Legacy SP mock
  callAuthorize(
    fcRootUrl: string,
    scopeContext: ScopeContext,
    acrValues = 'eidas1',
  ): void {
    const { scopes = [] } = scopeContext;

    const qs = {
      acr_values: acrValues,
      client_id: this.clientId,
      nonce: 'noncefortestsBDD',
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: Array.isArray(scopes) ? scopes.join(' ') : scopes,
      state: 'testsBDD',
    };

    cy.visit(`${fcRootUrl}/api/v1/authorize`, {
      failOnStatusCode: false,
      qs,
    });
  }

  // Setup and initiate FC connection using core v2 SP mock

  setMockAuthorizeHttpMethod(formMethod: 'get' | 'post'): void {
    cy.get('#httpMethod').select(formMethod);
  }

  setMockRequestedScope(scopeContext?: ScopeContext): void {
    if (scopeContext) {
      cy.get('input[name="scope"]').clear();
      const { scopes = [] } = scopeContext;
      const scopeValue = scopes.join(' ');
      if (scopeValue) {
        cy.get('input[name="scope"]').type(scopeValue);
      }
    }
  }

  setMockRequestedAcr(acrValue: string): void {
    cy.get('input[name="acr_values"]').clear();
    cy.get('input[name="acr_values"]').type(acrValue);
  }

  setMockRequestedAmr(isRequested: boolean): void {
    if (isRequested) {
      cy.get('#claim_amr').check();
    } else {
      cy.get('#claim_amr').uncheck();
    }
  }

  setIdpHint(idpHint: string): void {
    cy.get('input[name="idp_hint"]').clear();
    cy.get('input[name="idp_hint"]').type(idpHint);
  }

  startLogin(
    fcRootUrl: string,
    scopeContext: ScopeContext,
    claims: string[] = [],
    acrValue: string,
  ): void {
    // Initiate FS connection from Legacy SP mock
    if (this.isLegacySPMock()) {
      this.callAuthorize(fcRootUrl, scopeContext);
      return;
    }
    // Initiate FS connection from SP mock
    if (this.mocked) {
      this.setMockRequestedScope(scopeContext);
      this.setMockRequestedAmr(claims.includes('amr'));
      this.setMockRequestedAcr(acrValue);
    }
    this.getFcButton().click();
  }

  logout(): void {
    this.getLogoutButton().click();
    if (this.isLegacySPMock()) {
      // 2 clicks required on Legacy SP mock
      cy.get('#fconnect-access .logout a').click();
    }
  }

  getMockSubText(): Cypress.Chainable<string> {
    return cy
      .get('#json-output')
      .invoke('text')
      .then((text) => {
        const responseBody = JSON.parse(text.trim());
        return responseBody['sub'];
      });
  }

  checkMockInformationAccess(
    expectedClaims: string[],
    userClaims: UserClaims,
  ): void {
    cy.get('#json-output')
      .invoke('text')
      .then((text) => {
        const responseBody = JSON.parse(text.trim());

        // Check mandatory data
        const mandatoryData = {
          aud: /^[\w-]+$/,
          exp: /^\d+/,
          iat: /^\d+/,
          iss: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
          sub: /^[0-9a-f]{64}v1$/,
        };
        Object.keys(mandatoryData).forEach((key) =>
          expect(responseBody[key]).to.match(
            mandatoryData[key],
            `${key} should be present.`,
          ),
        );

        // Check expected claims (except sub)
        expectedClaims
          .filter((claimName) => claimName !== 'sub')
          .forEach((claimName) => {
            expect(responseBody[claimName]).to.deep.equal(
              userClaims[claimName],
              `The claim ${claimName} should be ${JSON.stringify(
                userClaims[claimName],
              )}`,
            );
          });

        // Check no extra claims
        const extraClaimsName = Object.keys(responseBody).filter(
          (key) => !mandatoryData[key] && !expectedClaims.includes(key),
        );
        expect(extraClaimsName).to.deep.equal(
          [],
          'No extra claims should be sent.',
        );
      });
  }

  checkTracks(): void {
    cy.get('#json-tracks')
      .invoke('text')
      .then((text) => {
        const content = text.trim();
        expect(content).not.to.be.empty;

        const responseBody = JSON.parse(content);
        expect(responseBody).to.exist;
        const { meta, payload } = responseBody;
        expect(meta.size).to.equal(500);
        expect(meta.offset).to.equal(0);
        expect(meta.total).to.be.greaterThan(0);

        // we retrieve maximum 500 events (meta.size)
        expect(payload.length).to.be.equal(Math.min(meta.total, meta.size));

        // we verify one fcpHigh event
        const fcpHighEvent = payload.find(
          ({ event, platform }) =>
            event === 'FC_VERIFIED' && platform === 'FranceConnect+',
        );
        expect(fcpHighEvent).to.exist;
        expect(['eidas2', 'eidas3']).to.include(fcpHighEvent.spAcr);
        expect(fcpHighEvent).to.include.all.keys(
          'event',
          'time',
          'spLabel',
          'spAcr',
          'idpLabel',
          'claims',
          'trackId',
          'platform',
        );

        // we verify one fcpLow event
        const fcpLowEvent = payload.find(
          ({ event, platform }) =>
            event === 'FC_VERIFIED' && platform === 'FranceConnect',
        );
        expect(fcpLowEvent).to.exist;
        expect(fcpLowEvent.spAcr).to.equal('eidas1');
        expect(fcpLowEvent).to.include.all.keys(
          'event',
          'time',
          'spLabel',
          'spAcr',
          'idpLabel',
          'claims',
          'trackId',
          'platform',
        );
      });
  }

  checkMockAcrValue(acrValue: string): void {
    cy.get('[id="info-acr"] strong').contains(acrValue);
  }

  checkMockAmrValue(amrValue: string): void {
    const amrArray = amrValue.split(' ');
    cy.get('[id="info-amr"] strong')
      .invoke('text')
      .then((value) => value.trim().split(' '))
      .should('have.members', amrArray);
  }

  getMockIdTokenText(): Cypress.Chainable<string> {
    return cy.get('[id="info-id-token"]').invoke('text');
  }

  checkIsMockDataPageVisible(): void {
    const dataPageURL = `${this.originUrl}/data`;
    cy.url().should('include', dataPageURL);
  }

  getMockIntrospectionTokenText(): Cypress.Chainable<string> {
    return cy.get('#json').first().invoke('text');
  }

  getInteractionErrorMessage(): ChainableElement {
    return cy.get('[data-testid="interaction-error-message"]');
  }
}
