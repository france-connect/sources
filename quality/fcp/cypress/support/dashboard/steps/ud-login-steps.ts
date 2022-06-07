import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

import {
  getDefaultIdentityProvider,
  getServiceProviderByDescription,
  navigateTo,
} from '../../common/helpers';
import { Environment } from '../../common/types';
import { ConnectionWorkflow } from '../../usager/steps/workflow-legacy-steps';
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
  const serviceProvider = getServiceProviderByDescription(
    this.serviceProviders,
    'user-dashboard',
  );
  const identityProvider = getDefaultIdentityProvider(this.identityProviders);
  new ConnectionWorkflow(this.env, serviceProvider)
    .init()
    .start()
    .selectIdentityProvider(identityProvider)
    .login(this.user)
    .consent();
});

Then(
  'je ne suis plus connecté au dashboard usager avec FranceConnect',
  function () {
    const serviceProvider = getServiceProviderByDescription(
      this.serviceProviders,
      'user-dashboard',
    );
    new ConnectionWorkflow(this.env, serviceProvider)
      .start()
      .checkIdpSelectionPageDisplayed();
  },
);
