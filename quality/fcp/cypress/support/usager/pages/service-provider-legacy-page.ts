import {
  ChainableElement,
  ScopeContext,
  ServiceProviderBase,
  UserClaims,
} from '../../common/types';
import { getClaims } from '../helpers';

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

  getFcButton(): ChainableElement {
    return cy.get(this.fcButtonSelector);
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

  callAuthorize(
    fcRootUrl: string,
    scopeContext: ScopeContext,
    acrValues: string,
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

  startLogin(
    fcRootUrl: string,
    scopeContext: ScopeContext,
    acrValues: string,
  ): void {
    if (this.mocked) {
      this.callAuthorize(fcRootUrl, scopeContext, acrValues);
    } else {
      this.getFcButton().click();
    }
  }

  logout(): void {
    this.getLogoutButton().click();
    cy.get('#fconnect-access .logout a').click();
  }

  checkMockInformationAccess(
    requestedScope: ScopeContext,
    userClaims: UserClaims,
  ): void {
    const expectedClaims = getClaims(requestedScope);
    cy.get('#json-output')
      .invoke('text')
      .then((text) => {
        const responseBody = JSON.parse(text.trim());

        // Check mandatory data
        const mandatoryData = {
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

  checkMockAcrValue(acrValue: string): void {
    cy.get('#info-acr').contains(acrValue);
  }

  checkMockErrorCallback(): void {
    const errorCallbackURL = `${this.originUrl}/login-callback?`;
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
    cy.url().should(
      'match',
      new RegExp(`(?<=[&|?])error_description=${errorDescription}(?=&|$)`),
    );
  }

  checkMockErrorDescriptionWithScopes(scopes: string[]): void {
    const errorDescription = `Requested+scope+%22${scopes.join(
      '+',
    )}%22.%0AScope+authorized`;
    cy.url().should('include', `error_description=${errorDescription}`);
  }
}
