import {
  getAuthorizeUrl,
  chooseIdpOnCore,
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
      nonce: ''
    });
    cy.visit(url, { failOnStatusCode: false });
    cy.hasError('Y000400');
  });

  it('should return an error if the nonce is not only ASCII (FC as IDP)', () => {
    const url = getAuthorizeUrl({
      nonce: 'éazerty123!'
    });
    cy.visit(url, { failOnStatusCode: false });
    cy.hasError('Y000400');
  });

  it('should send the nonce through the authorize url (FC as FS)', () => {
    const { IDP_ROOT_URL } = getIdentityProvider(`${Cypress.env('IDP_NAME')}1-low`);
    const url = getAuthorizeUrl();
    cy.visit(url);

    cy.intercept(`${IDP_ROOT_URL}/authorize?*`).as('getIdp');

    chooseIdpOnCore('fia1-low');
    cy.wait('@getIdp').then(({ request: { url } }) => {
      const nonceIsDefined = url.includes('nonce');
      expect(nonceIsDefined).to.be.true;
    });
  });
});
