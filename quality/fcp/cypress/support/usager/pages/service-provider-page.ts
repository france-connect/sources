import {
  ChainableElement,
  ScopeContext,
  ServiceProviderBase,
  UserClaims,
} from '../../common/types';
import { getClaims } from '../helpers';

export default class ServiceProviderPage {
  fcButtonSelector: string;
  logoutButtonSelector: string;
  originUrl: string;

  constructor(args: ServiceProviderBase) {
    const {
      selectors: { fcButton, logoutButton },
      url,
    } = args;
    this.fcButtonSelector = fcButton;
    this.logoutButtonSelector = logoutButton;
    this.originUrl = url;
  }

  get fcButton(): ChainableElement {
    return cy.get(this.fcButtonSelector);
  }

  get logoutButton(): ChainableElement {
    return cy.get(this.logoutButtonSelector);
  }

  checkIsVisible(): void {
    cy.url().should('include', this.originUrl);
  }

  checkIsUserConnected(isConnected = true): void {
    if (isConnected) {
      this.logoutButton.should('be.visible');
    } else {
      this.logoutButton.should('not.exist');
    }
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
          aud: /^\w+$/,
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
}
