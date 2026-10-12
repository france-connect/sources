import { Step, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import { getScopeByType, navigateTo } from '../../common/helpers';
import SpEidasMockPage from '../pages/sp-eidas-mock-page';

const spEidasMockPage = new SpEidasMockPage();

When('je navigue sur la page fournisseur de service eidas', function () {
  const { allAppsUrl } = this.env;
  const { name: spName } = this.serviceProvider;
  navigateTo({ appId: spName, baseUrl: allAppsUrl });
});

When('je configure un fournisseur de service sur eidas mock', function () {
  const { scopes } = this.requestedScope;
  const params = {
    citizenCountry: 'FR',
    nameId: this.requestedNameIdFormat,
    scopes,
    spCountry: 'CB',
  };
  spEidasMockPage.configureEidasSpMock(params);
});

Then(
  'je suis redirigé vers la page de callback fournisseur de service eidas mock',
  function () {
    spEidasMockPage.isReturnPageDisplayed();
  },
);

Then(
  "la réponse du fournisseur d'identité eidas mock contient un nameId au format {string}",
  function (nameIdFormat: string) {
    spEidasMockPage.checkSubjectNameIdFormat(nameIdFormat);
  },
);

Then(
  "la réponse du fournisseur d'identité eidas mock contient le level of assurance {string}",
  function (levelOfAssurance: string) {
    spEidasMockPage
      .getReturnPageRawResponse()
      .should(
        'contain',
        `"authentication_context_class" : "${levelOfAssurance}",`,
      );
  },
);

When('je continue vers la page fournisseur de service eidas mock', function () {
  spEidasMockPage.retrieveClaims();
});

When("j'avance jusqu'à la page fournisseur de service eidas mock", function () {
  Step(
    this,
    'je suis redirigé vers la page de callback fournisseur de service eidas mock',
  );
  Step(this, 'je continue vers la page fournisseur de service eidas mock');
});

Then(
  'le fournisseur de service eidas mock a accès aux informations des scopes {string}',
  function (scopeType: string) {
    const { name: testEnv } = this.env;
    const { name: spName } = this.serviceProvider;
    const { claims, eidasClaims } = this.user;
    const { scopes } = getScopeByType(this.scopes, scopeType);

    spEidasMockPage.checkClaims(scopes, claims, eidasClaims, testEnv, spName);
  },
);

Then(
  'le sub transmis au fournisseur de service eidas commence par {string}',
  function (text: string) {
    spEidasMockPage.checkSubStartWith(text);
  },
);
