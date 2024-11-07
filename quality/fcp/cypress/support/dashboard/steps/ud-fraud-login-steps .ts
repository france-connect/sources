import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import {
  getIdentityProviderByDescription,
  getServiceProviderByDescription,
  navigateTo,
} from '../../common/helpers';
import { ConnectionWorkflow } from '../../usager/steps/workflow-steps';
import UdFraudLoginPage from '../pages/ud-fraud-login-page';

let udFraudLoginPage: UdFraudLoginPage;

Given(
  'je navigue sur la page de connexion du formulaire usurpation',
  function () {
    const { allAppsUrl, udRootUrl } = this.env;
    navigateTo({ appId: 'ud-fraud-login', baseUrl: allAppsUrl });
    udFraudLoginPage = new UdFraudLoginPage(udRootUrl);
    udFraudLoginPage.checkIsVisible();
  },
);

Given(
  /^je suis (redirigé vers|sur) la page de connexion du formulaire usurpation$/,
  function () {
    const { udRootUrl } = this.env;
    udFraudLoginPage = new UdFraudLoginPage(udRootUrl);
    udFraudLoginPage.checkIsVisible();
  },
);

When('je me connecte pour accéder au formulaire usurpation', function () {
  const serviceProvider = getServiceProviderByDescription(
    this.serviceProviders,
    'user-dashboard-fraud',
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
  "le lien vers l'application Formulaire Usager est affiché sur la page de connexion du formulaire usurpation",
  function () {
    udFraudLoginPage.getFraudSupportFormLink().should('be.visible');
  },
);

Then(
  /^le lien vers l'application Formulaire Usager comporte la valeur "([^"]+)" pour le paramètre fraudSurveyOrigin$/,
  function (fraudSurveyOrigin: string) {
    udFraudLoginPage
      .getFraudSupportFormLink()
      .invoke('attr', 'href')
      .should('include', `usurpation/${fraudSurveyOrigin}`);
  },
);

Then(
  /^le message d'alerte "session expirée" (est|n'est pas) affiché sur la page de connexion du formulaire usurpation$/,
  function (text) {
    const isDisplayed = text === 'est';
    udFraudLoginPage.checkIsExpiredSessionAlertDisplayed(isDisplayed);
  },
);
