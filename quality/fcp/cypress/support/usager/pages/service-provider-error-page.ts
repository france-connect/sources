const ERROR_URL_REGEXP =
  /^https:\/\/.*\/oidc-callback([?#])error=([^&]+)&error_description=([^&]+)&state=.+$/;
const URL_TYPE_GROUP = 1;
const ERROR_GROUP = 2;
const ERROR_DESCRIPTION_GROUP = 3;

export default class ServiceProviderErrorPage {
  checkIsVisible(): void {
    cy.contains('h1', 'Une erreur est survenue').should('be.visible');
  }

  checkErrorCode(errorCode: string): void {
    cy.get('span#error-title')
      .invoke('text')
      .then((text) => text.trim())
      .should('equal', errorCode);
  }

  checkErrorDescription(errorDescription: string): void {
    cy.get('#error-description')
      .invoke('text')
      .then((text) => text.trim())
      .should('equal', errorDescription);
  }

  checkErrorCallbackUrl(url: string, containsQuery = true): void {
    const match = url.match(ERROR_URL_REGEXP);
    expect(match.length).to.equal(4);
    const delimitor = containsQuery ? '?' : '#';
    expect(match[URL_TYPE_GROUP]).to.equal(delimitor);
  }

  checkParamInCallbackUrl(url: string, key: string, value: string): void {
    const callbackUrl = new URL(url);
    expect(
      callbackUrl.searchParams.has(key),
      `the parameter '${key}' is missing in the callback url '${url}'`,
    ).to.be.true;
    expect(callbackUrl.searchParams.get(key)).to.equal(value);
  }

  checkErrorInCallbackUrl(url: string, error: string): void {
    const encodedError = encodeURIComponent(error);
    const match = url.match(ERROR_URL_REGEXP);
    expect(match.length).to.equal(4);
    expect(match[ERROR_GROUP]).to.equal(encodedError);
  }

  checkErrorDescriptionInCallbackUrl(
    url: string,
    errorDescription: string,
  ): void {
    const encodedDescription = encodeURIComponent(errorDescription).replace(
      /'/g,
      '%27',
    );
    const encodedUrl = url.replace(/\+/g, '%20');

    const match = encodedUrl.match(ERROR_URL_REGEXP);
    expect(match.length).to.equal(4);
    expect(match[ERROR_DESCRIPTION_GROUP]).to.equal(encodedDescription);
  }
}
