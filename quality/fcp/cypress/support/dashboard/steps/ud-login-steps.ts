import { Given, When } from 'cypress-cucumber-preprocessor/steps';

import { User } from '../../common/helpers';
import { Environment } from '../../common/types';
import UdLoginPage from '../pages/ud-login-page';

let udLoginPage: UdLoginPage;

Given("je navigue sur la page d'accueil du dashboard usager", function () {
  const { udRootUrl }: Environment = this.env;
  /**
   * @todo This will not work on integ01. We need to start rp-all to navigate
   * to user-dashboard via the list of systems from fcp.html using navigateTo
   * @author Nicolas Legeay
   * date: 10/09/2021
   */
  cy.visit(udRootUrl);
  udLoginPage = new UdLoginPage(udRootUrl);
  udLoginPage.checkIsVisible();
});

When('je me connecte au dashboard usager', function () {
  const user: User = this.user;
  const credentials = user.getCredentials('fip1');
  udLoginPage.login(credentials);
});
