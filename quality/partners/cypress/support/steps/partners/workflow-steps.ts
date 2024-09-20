import { When } from '@badeball/cypress-cucumber-preprocessor';

import { waitForConnectionStatus } from '../../helpers';
import LoginPage from '../../pages/login-page';
import OidcProviderPage from '../../pages/oidc-provider-page';
import TopMenuComponent from '../../pages/top-menu-component';
import { UserData } from '../../types';

const loginPage = new LoginPage();
const oidcProviderPage = new OidcProviderPage();
const topMenuComponent = new TopMenuComponent();

class ConnectionWorkflow {
  /**
   * Navigate to the partners website
   * @returns the current ConnectionWorkflow instance
   */
  init(): this {
    cy.visit('/');
    return this;
  }

  /**
   * Login to partners website via an Oidc Provider
   * @returns the current ConnectionWorkflow instance
   */
  login({ credentials }: UserData): this {
    loginPage.getLoginButton().click();
    oidcProviderPage.login(credentials);
    waitForConnectionStatus();
    return this;
  }

  /**
   * Logout to partners website
   * @returns the current ConnectionWorkflow instance
   */
  logout(): this {
    topMenuComponent.getLogoutLink().click();
    waitForConnectionStatus();
    return this;
  }

  /**
   * Check that the user is connected on the service provider page
   */
  checkIsConnected(isConnected: boolean): void {
    topMenuComponent.checkIsUserConnected(isConnected);
  }
}

When("je me connecte à l'espace partenaires", function () {
  expect(this.user).to.exist;

  new ConnectionWorkflow().init().login(this.user).checkIsConnected(true);
});

When("je me déconnecte de l'espace partenaires", function () {
  expect(this.user).to.exist;

  new ConnectionWorkflow().logout().checkIsConnected(false);
});
