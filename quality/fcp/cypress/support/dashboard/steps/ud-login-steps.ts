import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

import { navigateTo, User } from '../../common/helpers';
import { Environment } from '../../common/types';
import UdLoginPage from '../pages/ud-login-page';

let udLoginPage: UdLoginPage;

Given("je navigue sur la page d'accueil du dashboard usager", function () {
  const { allAppsUrl, udAppId, udRootUrl }: Environment = this.env;
  navigateTo({ appId: udAppId, baseUrl: allAppsUrl });
  udLoginPage = new UdLoginPage(udRootUrl);
  udLoginPage.checkIsVisible();
});

Then(
  /^je suis (redirigé vers|sur) la page d'accueil du dashboard usager$/,
  function () {
    const { udRootUrl }: Environment = this.env;
    udLoginPage = new UdLoginPage(udRootUrl);
    udLoginPage.checkIsVisible();
  },
);

When('je me connecte au dashboard usager', function () {
  const user: User = this.user;
  const credentials = user.getCredentials('fip1');
  udLoginPage.login(credentials);
});

Then(
  'je ne suis plus connecté au dashboard usager avec FranceConnect',
  function () {
    udLoginPage.checkIsNotConnected();
  },
);
