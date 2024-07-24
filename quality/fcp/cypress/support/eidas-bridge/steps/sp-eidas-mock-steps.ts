import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import { navigateTo } from '../../common/helpers';
import { getScopeByType } from '../../usager/helpers';
import SpEidasMockPage from '../pages/sp-eidas-mock-page';

const spEidasMockPage = new SpEidasMockPage();

When('je navigue sur la page fournisseur de service eidas', function () {
  const { allAppsUrl } = this.env;
  const { name: spName } = this.serviceProvider;
  navigateTo({ appId: spName, baseUrl: allAppsUrl });
});

When('je configure un fournisseur de service sur eidas mock', function () {
  const { scopes } = this.requestedScope;
  spEidasMockPage.configureEidasSpMock({ scopes });
});

Then(
  'je suis redirigé vers la page fournisseur de service eidas mock',
  function () {
    spEidasMockPage.isReturnPageDisplayed();
    spEidasMockPage.retrieveClaims();
  },
);

Then(
  'le fournisseur de service eidas mock a accès aux informations des scopes {string}',
  function (scopeType: string) {
    const { name: spName } = this.serviceProvider;
    const { claims, eidasClaims } = this.user;
    const { scopes } = getScopeByType(this.scopes, scopeType);

    spEidasMockPage.checkClaims(scopes, claims, eidasClaims, spName);
  },
);

Then(
  'le sub transmis au fournisseur de service eidas commence par {string}',
  function (text: string) {
    spEidasMockPage.checkSubStartWith(text);
  },
);
