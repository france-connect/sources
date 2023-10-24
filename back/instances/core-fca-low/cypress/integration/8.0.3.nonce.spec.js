import {
  chooseIdpOnCore,
  getAuthorizeUrl,
  getIdentityProvider,
} from './mire.utils';

describe('nonce', () => {
  it('should return an error if the nonce is not provided (FC as IDP)', () => {
    const url = getAuthorizeUrl({}, 'nonce');
    cy.visit(url, { failOnStatusCode: false });
    cy.hasError('Y000400');
  });

  it('should return an error if the nonce is less than 1 character (FC as IDP)', () => {
    const url = getAuthorizeUrl({
      nonce: '',
    });
    cy.visit(url, { failOnStatusCode: false });
    cy.hasError('Y000400');
  });

  it('should return an error if the nonce is not only ASCII (FC as IDP)', () => {
    const url = getAuthorizeUrl({
      nonce: 'éazerty123!',
    });
    cy.visit(url, { failOnStatusCode: false });
    cy.hasError('Y000400');
  });

  it('should send the nonce through the authorize url (FC as FS)', () => {
    const { IDP_ROOT_URL } = getIdentityProvider(
      '9c716f61-b8a1-435c-a407-ef4d677ec270',
    );
    const url = getAuthorizeUrl();
    cy.visit(url);

    cy.intercept(`${IDP_ROOT_URL}/authorize?*`).as('getIdp');

    chooseIdpOnCore('9c716f61-b8a1-435c-a407-ef4d677ec270');
    cy.wait('@getIdp').then(({ request: { url } }) => {
      const nonceIsDefined = url.includes('nonce');
      expect(nonceIsDefined).to.be.true;
    });
  });
});
