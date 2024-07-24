import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import IdentityProviderPage from '../pages/identity-provider-page';

let identityProviderPage: IdentityProviderPage;

Then(
  /^je (suis|ne suis pas) redirigé vers la page login du fournisseur d'identité$/,
  function (text: string) {
    const expectVisible = text === 'suis';
    identityProviderPage = new IdentityProviderPage(this.identityProvider);
    if (expectVisible) {
      identityProviderPage.checkIsVisible();
    } else {
      identityProviderPage.checkIsNotVisible();
    }
  },
);

When(
  "le fournisseur d'identité garantit un niveau de sécurité {string}",
  function (acr: string) {
    identityProviderPage.setMockAcrValue(acr);
    this.identityProvider.acrValue = acr;
  },
);

When("je m'authentifie avec succès", function () {
  expect(this.user).to.exist;

  const { idpId } = this.identityProvider;
  const userCredentials = this.user.getCredentials(idpId);
  expect(userCredentials).to.exist;
  identityProviderPage.login(userCredentials);
});

When(
  `je m'authentifie avec succès avec l'identifiant {string}`,
  function (login: string) {
    identityProviderPage.loginWithUsername(login);
  },
);

When("je saisi manuellement l'identité de l'utilisateur", function () {
  expect(this.user).to.exist;

  identityProviderPage.useCustomIdentity(this.user);
});

Then('le champ identifiant correspond à {string}', function (login: string) {
  identityProviderPage.getLogin().invoke('val').should('be.equal', login);
});

Given(
  'je paramètre un intercepteur pour retirer le paramètre {string} au prochain appel authorize à AgentConnect',
  function (param: string) {
    const { fcaRootUrl } = this.env;
    cy.intercept(`${fcaRootUrl}/api/v2/authorize*`, (req) => {
      if (req.method === 'GET') {
        delete req.query[param];
        return;
      }
      const searchParams = new URLSearchParams(req.body);
      searchParams.delete(param);
      req.body = searchParams.toString();
    }).as('AC:AuthorizeRemoveParam');
  },
);

Then("la page du FI affiche l'id du FS", function () {
  identityProviderPage.checkSpIdIsVisible(this.serviceProvider.clientId);
});
