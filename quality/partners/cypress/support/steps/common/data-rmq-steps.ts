import { Given, Step } from '@badeball/cypress-cucumber-preprocessor';

import { getRmqMessage } from '../../helpers';

Given(
  "j'utilise le message RabbitMQ {string} pour {string}",
  function (messageName: string, service: string) {
    getRmqMessage(service, messageName).as('rmqRequestMessage');
  },
);

Given(
  'je mets {string} dans la propriété {string} du message RabbitMQ',
  function (value: string, property: string) {
    this.rmqRequestMessage = {
      ...this.rmqRequestMessage,
      payload: {
        ...this.rmqRequestMessage.payload,
        [property]: value,
      },
    };
  },
);

Given(
  'je retire la propriété {string} du message RabbitMQ',
  function (property: string) {
    expect(this.rmqRequestMessage?.payload?.[property]).to.exist;
    delete this.rmqRequestMessage?.payload?.[property];
  },
);

Given(
  'je mets un nouveau clientId dans la propriété {string} du message RabbitMQ',
  function (property: string) {
    //TODO Generate a valid clientId format
    const value = Cypress._.random(0, 1e15);
    Step(
      this,
      `je mets "${value}" dans la propriété "${property}" du message RabbitMQ`,
    );
  },
);
