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
  sub: /^[0-9a-f]{64}$/,
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
      cy.get('input[name="scope"]').clear();
      const { scopes = [] } = scopeContext;
      const scopeValue = scopes.join(' ');
      if (scopeValue) {
        cy.get('input[name="scope"]').type(scopeValue);
      }
    }
  }

  setMockRequestedAcr(acrValue: string): void {
    cy.get('input[name="acr_values"]').clear().type(acrValue);
  }

  setMockRequestedAmr(isRequested: boolean): void {
    if (isRequested) {
      cy.get('#claim_amr').check();
    } else {
      cy.get('#claim_amr').uncheck();
    }
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
    this.getUserInfo().then((responseBody: Record<string, unknown>) => {
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
    this.getUserInfo().then((responseBody: Record<string, unknown>) => {
      Object.keys(userClaims)
        .filter((userClaim) => expectedClaims.includes(userClaim))
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
    this.getUserInfo().then((responseBody: Record<string, unknown>) => {
      const extraClaimsName = Object.keys(responseBody).filter(
        (key) => !mandatoryData[key] && !expectedClaims.includes(key),
      );
      expect(extraClaimsName).to.deep.equal(
        [],
        'No extra claims should be sent.',
      );
    });
  }
}
