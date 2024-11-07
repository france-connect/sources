import { Then } from '@badeball/cypress-cucumber-preprocessor';

import UdFraudFormSupportNotificationPage from '../pages/ud-fraud-form-support-notification';

const udFraudFormSupportNotificationPage =
  new UdFraudFormSupportNotificationPage();

Then('le mail "demande de support" est envoyé', function () {
  const { contactEmail } = this.fraudFormValues;
  // Wait for the email to reach maildev
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  udFraudFormSupportNotificationPage
    .getLastSupportRequest(contactEmail)
    .then((message) => {
      this.mail = message;
      this.mailBodyContent =
        udFraudFormSupportNotificationPage.parseBodyContent(message.html);
    });
});

Then(
  'le sujet est {string} dans le mail "demande de support"',
  function (text: string) {
    const { subject } = this.mail;
    expect(subject).to.equal(text);
  },
);

Then(`l'expéditeur est correct dans le mail "demande de support"`, function () {
  const { from } = this.mail;
  expect(from.length).to.equal(1);
  const [firstSender] = from;
  const { address } = firstSender;
  const { contactEmail } = this.fraudFormValues;
  expect(contactEmail).to.exist;
  expect(contactEmail).to.equal(address);
});

Then(
  'le destinataire est le "Support Sécurité" dans le mail "demande de support"',
  function () {
    const { to } = this.mail;
    expect(to.length).to.equal(1);
    const [firstRecipient] = to;
    const { name } = firstRecipient;
    expect(name).to.equal('Support Sécurité');
  },
);

Then(
  '{string} est {string} dans le mail "demande de support"',
  function (contentKey: string, value: string) {
    udFraudFormSupportNotificationPage.checkBodyContent(
      this.mailBodyContent,
      contentKey,
      value,
    );
  },
);

Then(
  `"Email du compte FI" contient l'email du compte FI dans le mail "demande de support"`,
  function () {
    const { email } = this.user.claims as {
      email: string;
    };
    udFraudFormSupportNotificationPage.checkBodyContent(
      this.mailBodyContent,
      'Email du compte FI',
      email,
    );
  },
);

Then(
  `les informations d'identité sont présentes dans le mail "demande de support"`,
  function () {
    const {
      birthcountry,
      birthdate,
      birthplace,
      family_name: lastName,
      given_name: firstName,
    } = this.user.claims as {
      birthcountry: string;
      birthdate: string;
      birthplace: string;
      family_name: string;
      given_name: string;
    };

    udFraudFormSupportNotificationPage.checkIdPivotValuesInBodyContent(
      {
        birthcountry,
        birthdate,
        birthplace,
        firstName,
        lastName,
      },
      this.mailBodyContent,
    );
  },
);

Then(
  `les champs du formulaire sont présents dans le mail "demande de support"`,
  function () {
    udFraudFormSupportNotificationPage.checkFraudFormValuesInBodyContent(
      this.fraudFormValues,
      this.mailBodyContent,
    );
  },
);

Then(
  `{string} n'est pas présent dans le mail "demande de support"`,
  function (contentKey: string) {
    udFraudFormSupportNotificationPage.checkBodyContentKeyNotExist(
      this.mailBodyContent,
      contentKey,
    );
  },
);
