import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import {
  getIdentityProviderByDescription,
  getServiceProviderByDescription,
  navigateTo,
} from '../../common/helpers';
import { ConnectionWorkflow } from '../../usager/steps/workflow-steps';
import UdLoginPage from '../pages/ud-login-page';

let udLoginPage: UdLoginPage;

Given(
  "je navigue sur la page d'accueil du tableau de bord usager",
  function () {
    const { allAppsUrl, udAppId, udRootUrl } = this.env;
    navigateTo({ appId: udAppId, baseUrl: allAppsUrl });
    udLoginPage = new UdLoginPage(udRootUrl);
    udLoginPage.checkIsVisible();
  },
);

Then(
  /^je suis (redirigé vers|sur) la page d'accueil du tableau de bord usager$/,
  function () {
    const { udRootUrl } = this.env;
    udLoginPage = new UdLoginPage(udRootUrl);
    udLoginPage.checkIsVisible();
  },
);

Then(
  /^le message d'alerte "session expirée" (est|n'est pas) affiché sur la page d'accueil$/,
  function (text) {
    const isDisplayed = text === 'est';
    udLoginPage.checkIsExpiredSessionAlertDisplayed(isDisplayed);
  },
);

When(
  'je clique sur le bouton FranceConnect du tableau de bord usager',
  function () {
    udLoginPage.getAuthorizeButton().click();
  },
);

When('je me connecte au tableau de bord usager', function () {
  const serviceProvider = getServiceProviderByDescription(
    this.serviceProviders,
    'user-dashboard',
  );
  const IDP_DESCRIPTION = 'pour user-dashboard (core v2)';
  const identityProvider = getIdentityProviderByDescription(
    this.identityProviders,
    IDP_DESCRIPTION,
  );
  new ConnectionWorkflow(this.env, serviceProvider)
    .start()
    .selectIdentityProvider(identityProvider)
    .login(this.user)
    .consent();
});

Then(
  'je ne suis plus connecté au tableau de bord usager avec FranceConnect',
  function () {
    const serviceProvider = getServiceProviderByDescription(
      this.serviceProviders,
      'user-dashboard',
    );
    new ConnectionWorkflow(this.env, serviceProvider)
      .init()
      .start()
      .checkIdpSelectionPageDisplayed();
  },
);
