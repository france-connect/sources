import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import { checkClipboardWrite, spyClipboardWrite } from '../../helpers';
import InstanceFormPage from '../../pages/instance-form-page';

const instanceFormPage = new InstanceFormPage();

Then(
  `le "client_id" est identique dans le formulaire de modification d'instance`,
  function () {
    const { client_id: clientId } = this;
    expect(clientId).to.exist;
    instanceFormPage.getClientId().should('equal', clientId);
  },
);

Then(
  `le "client_secret" est identique dans le formulaire de modification d'instance`,
  function () {
    const { client_secret: clientSecret } = this;
    expect(clientSecret).to.exist;
    instanceFormPage.getClientSecret().should('equal', clientSecret);
  },
);

Then(
  `le bouton "copier le client_id" est affiché dans le formulaire de modification d'instance`,
  function () {
    instanceFormPage
      .getCopyClientIdButton()
      .should('be.visible')
      .should('be.enabled');
  },
);

Then(
  `le bouton "copier le client_secret" est affiché dans le formulaire de modification d'instance`,
  function () {
    instanceFormPage
      .getCopyClientSecretButton()
      .should('be.visible')
      .should('be.enabled');
  },
);

When(
  /^je clique sur le bouton "copier le (client_id|client_secret)"$/,
  function (key: string) {
    spyClipboardWrite();
    if (key === 'client_id') {
      instanceFormPage.getCopyClientIdButton().click();
    } else {
      instanceFormPage.getCopyClientSecretButton().click();
    }
  },
);

Then(
  /^le "(client_id|client_secret)" est dans le presse papier$/,
  function (key: string) {
    const text = this[key];
    checkClipboardWrite(text);
  },
);
