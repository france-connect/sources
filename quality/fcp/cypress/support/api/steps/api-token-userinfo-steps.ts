import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then(
  /^le corps de la réponse contient le (JWT|JWE) id_token pour le FS(?: avec chiffrement "(RSA-OAEP-256|ECDH-ES)")?$/,
  function (tokenType: string, encAlg?: string) {
    cy.get('@apiResponse')
      .its('body.id_token')
      .then((idToken) => {
        expect(idToken).to.be.a('string');
        expect(idToken.length).to.be.greaterThan(500);
        const privateKey =
          encAlg === 'ECDH-ES'
            ? Cypress.env('EC_ENC_PRIV_KEY')
            : Cypress.env('RSA_ENC_PRIV_KEY');
        const jwk = tokenType === 'JWE' ? privateKey : undefined;
        cy.task('getJwtContent', { jwk, jwt: idToken })
          .as('jwt')
          .then((jwtContent) => {
            const content = JSON.stringify(jwtContent, null, 2);
            cy.document().then((document) => {
              document.documentElement.innerHTML = content;
            });
          });
      });
  },
);

Then(
  /^le JWT id_token est signé avec la clé "(RS256|ES256)" de FranceConnect$/,
  function (sigAlg: string) {
    const jws = this.jwt?.rawJwt;
    expect(jws, 'No JWT id_token found').to.exist;
    cy.request('GET', `${this.env.fcRootUrl}/api/v2/jwks`)
      .its('body')
      .then(({ keys }) => {
        const jwk = keys.find((key) => key.alg === sigAlg && key.use === 'sig');
        expect(jwk, `JWK with alg=${sigAlg} and use=sig not found in FC jwks`)
          .to.exist;

        cy.task('verifyJwsSignature', {
          jws,
          keys,
          sigAlg,
        }).should('be.equal', true);
      });
  },
);

Then(
  /^le corps de la réponse contient le (JWT|JWE) userinfo pour le FS(?: avec chiffrement "(RSA-OAEP-256|ECDH-ES)")?$/,
  function (tokenType: string, encAlg?: string) {
    cy.get('@apiResponse')
      .its('body')
      .then((body) => {
        expect(body).to.be.a('string');
        expect(body.length).to.be.greaterThan(500);
        const privateKey =
          encAlg === 'ECDH-ES'
            ? Cypress.env('EC_ENC_PRIV_KEY')
            : Cypress.env('RSA_ENC_PRIV_KEY');
        const jwk = tokenType === 'JWE' ? privateKey : undefined;
        cy.task('getJwtContent', { jwk, jwt: body })
          .as('jwt')
          .then((jwtContent) => {
            const content = JSON.stringify(jwtContent, null, 2);
            cy.document().then((document) => {
              document.documentElement.innerHTML = content;
            });
          });
      });
  },
);

Then(
  /^le JWT userinfo est signé avec la clé "(RS256|ES256)" de FranceConnect$/,
  function (sigAlg: string) {
    const jws = this.jwt?.rawJwt;
    cy.request('GET', `${this.env.fcRootUrl}/api/v2/jwks`)
      .its('body')
      .then(({ keys }) => {
        const jwk = keys.find((key) => key.alg === sigAlg && key.use === 'sig');
        expect(jwk, `JWK with alg=${sigAlg} and use=sig not found in FC jwks`)
          .to.exist;

        cy.task('verifyJwsSignature', {
          jws,
          keys,
          sigAlg,
        }).should('be.equal', true);
      });
  },
);
