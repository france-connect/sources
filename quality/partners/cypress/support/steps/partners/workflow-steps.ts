import { Given, Step, When } from '@badeball/cypress-cucumber-preprocessor';

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
   * Login to partners website via an Oidc Provider
   * @returns the current ConnectionWorkflow instance
   */
  login({ credentials }: UserData): this {
    const { username } = credentials;
    cy.session(
      username,
      () => {
        topMenuComponent.visitHomePage();
        loginPage.getLoginButton().click();
        oidcProviderPage.login(credentials);
      },
      {
        cacheAcrossSpecs: true,
        validate() {
          topMenuComponent.checkIsConnected();
        },
      },
    );
    topMenuComponent.visitHomePage();
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
    topMenuComponent.checkIsConnected(isConnected);
  }
}

When("je me connecte à l'espace partenaires", function () {
  expect(this.user).to.exist;

  new ConnectionWorkflow().login(this.user).checkIsConnected(true);
});

Given(
  "je me connecte à l'espace partenaires avec un utilisateur {string}",
  function (description: string) {
    // See nested steps: https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/cucumber-basics.md#nested-steps
    Step(this, `je suis un utilisateur "${description}"`);
    Step(this, "je me connecte à l'espace partenaires");
  },
);

When("je me déconnecte de l'espace partenaires", function () {
  expect(this.user).to.exist;

  new ConnectionWorkflow().logout().checkIsConnected(false);
});
