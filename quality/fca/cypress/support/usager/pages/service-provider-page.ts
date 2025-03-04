import {
  ChainableElement,
  ScopeContext,
  ServiceProviderBase,
  UserClaims,
} from '../../common/types';

const mandatoryData = {
  aud: /^\w+$/,
  exp: /^\d+/,
  iat: /^\d+/,
  iss: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  sub: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
};

export default class ServiceProviderPage {
  fcaButtonSelector: string;
  logoutButtonSelector: string;
  originUrl: string;

  constructor(args: ServiceProviderBase) {
    const {
      selectors: { fcaButton, logoutButton },
      url,
    } = args;
    this.fcaButtonSelector = fcaButton;
    this.logoutButtonSelector = logoutButton;
    this.originUrl = url;
  }

  getFcaButton(): ChainableElement {
    return cy.get(this.fcaButtonSelector);
  }

  getLogoutButton(): ChainableElement {
    return cy.get(this.logoutButtonSelector);
  }

  getMockSubText(): Cypress.Chainable<string> {
    return cy
      .get('#json')
      .invoke('text')
      .then((text) => {
        const responseBody = JSON.parse(text.trim());
        return responseBody['sub'];
      });
  }

  getUserInfoButton(): ChainableElement {
    return cy.get('#reload-userinfo');
  }

  checkIsVisible(): void {
    cy.url().should('include', this.originUrl);
  }

  checkIsUserConnected(isConnected = true): void {
    const state = isConnected ? 'be.visible' : 'not.exist';
    this.getLogoutButton().should(state);
  }

  setMockAuthorizeHttpMethod(formMethod: 'get' | 'post'): void {
    cy.get('#httpMethod').select(formMethod);
  }

  setMockRequestedScope(scopeContext?: ScopeContext): void {
    if (scopeContext) {
      const { scopes = [] } = scopeContext;
      const scopeValue = scopes.join(' ');
      cy.get('input[name="scope"]').clearThenType(scopeValue);
    }
  }

  setMockRequestedAcr(acrValue?: string): void {
    if (!acrValue) {
      cy.get('input[name="acr_values"]').clear();
      cy.get('input[id="acr_values_toggle"]').uncheck();
    } else {
      cy.get('input[name="acr_values"]').clearThenType(acrValue);
    }
  }

  setMockRequestedAmr(isRequested: boolean): void {
    if (isRequested) {
      cy.get('#claim_amr').check();
    } else {
      cy.get('#claim_amr').uncheck();
    }
  }

  disablePrompt(): void {
    cy.get('#prompt_toggle').uncheck();
  }

  setPrompt(prompt: string): void {
    cy.get('input[name="prompt"').clearThenType(prompt);
  }

  setIdpHint(idpHint: string): void {
    cy.get('input[name="idp_hint"]').clearThenType(idpHint);
  }

  getUserInfo(): Cypress.Chainable<unknown> {
    return cy
      .get('#json')
      .invoke('text')
      .then((text) => {
        const responseBody = JSON.parse(text.trim());
        expect(Array.isArray(responseBody)).to.be.false;
        return responseBody;
      });
  }

  checkMockAcrValue(acrValue: string): void {
    cy.get('[id="info-acr"] strong').contains(acrValue);
  }

  checkMockAmrValue(amrValue: string): void {
    cy.get('[id="info-amr"] strong').contains(amrValue);
  }

  checkMockErrorCallback(): void {
    const errorCallbackURL = `${this.originUrl}/error`;
    cy.url().should('include', errorCallbackURL);
  }

  checkMockErrorCode(errorCode: string): void {
    const encodedError = encodeURIComponent(errorCode);
    cy.url().should(
      'match',
      new RegExp(`(?<=[&|?])error=${encodedError}(?=&|$)`),
    );
  }

  checkMockErrorDescription(errorDescription: string): void {
    const encodedDescription = encodeURIComponent(errorDescription);
    cy.url().should(
      'match',
      new RegExp(`(?<=[&|?])error_description=${encodedDescription}(?=&|$)`),
    );
  }

  checkMandatoryData(): void {
    this.getUserInfo().then((responseBody) => {
      Object.keys(mandatoryData).forEach((key) =>
        expect(responseBody[key]).to.match(
          mandatoryData[key],
          `${key} should be present.`,
        ),
      );
    });
  }

  // Check the userInfo claims against the user fixtures
  checkExpectedUserClaims(
    expectedClaims: string[],
    userClaims: UserClaims,
  ): void {
    this.getUserInfo().then((responseBody) => {
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
    });
  }

  checkNoExtraClaims(expectedClaims: string[]): void {
    this.getUserInfo().then((responseBody) => {
      const extraClaimsName = Object.keys(responseBody).filter(
        (key) => !mandatoryData[key] && !expectedClaims.includes(key),
      );
      expect(extraClaimsName).to.deep.equal(
        [],
        'No extra claims should be sent.',
      );
    });
  }

  getMockIntrospectionTokenText(): Cypress.Chainable<string> {
    return cy.get('#json').first().invoke('text');
  }

  getRevokeTokenButton(): ChainableElement {
    return cy.get('#revoke-token');
  }

  getDataButton(): ChainableElement {
    return cy.get('[data-testid="get-data-link"]');
  }

  checkIsMockDataPageVisible(): void {
    const dataPageURL = `${this.originUrl}/data`;
    cy.url().should('include', dataPageURL);
  }

  getTokenRevokationConfirmation(): ChainableElement {
    return cy.contains('h1', 'Le token a été révoqué');
  }
}
