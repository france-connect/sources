import { getAuthorizeUrl, getIdentityProvider } from './mire.utils';

describe('8.0.3 - nonce', () => {
  it('should return an error if the nonce is not provided (FC as IDP)', () => {
    const url = getAuthorizeUrl({}, 'nonce');
    cy.visit(url, { failOnStatusCode: false });
    cy.hasError('Y030007');
  });

  it('should return an error if the nonce is too short (FC as IDP)', () => {
    const url = getAuthorizeUrl({
      nonce: 'thirtyonecharcterscharacterssss',
    });
    cy.visit(url, { failOnStatusCode: false });
    cy.hasError('Y030007');
  });

  it('should send the nonce through the authorize url (FC as FS) - a nonce being at least 32 characters long', () => {
    const idpId = 'dedc7160-8811-4d0f-9dd7-c072c15f2f18';
    const idpInfo = getIdentityProvider(idpId);

    const url = getAuthorizeUrl({
        nonce: 'nonceatleastthirtytwocharacterss',
      });
    cy.visit(url);

    cy.intercept(`${idpInfo.IDP_ROOT_URL}/authorize*`).as('getIdp');

    cy.get(`#idp-${idpId}`).click();
    cy.wait('@getIdp').then(({ request: { url } }) => {
      const nonceIsDefined = url.includes('nonce');
      expect(nonceIsDefined).to.be.true;
    });
  });

  it('should succeed to pass through the nonce if it has a length of 64 characters (and special characters)', () => {
    const idpId = 'dedc7160-8811-4d0f-9dd7-c072c15f2f18';
    const idpInfo = getIdentityProvider(idpId);

    const url = getAuthorizeUrl({
        nonce: 'nonceatleastsixtyfourcharacterss@#&nonceatleastsixtyfourcharacterss',
      });
    cy.visit(url);

    cy.intercept(`${idpInfo.IDP_ROOT_URL}/authorize*`).as('getIdp');

    cy.get(`#idp-${idpId}`).click();
    cy.wait('@getIdp').then(({ request: { url } }) => {
      const nonceIsDefined = url.includes('nonce');
      expect(nonceIsDefined).to.be.true;
    });
  });
});
