import { RmqMessage } from '../types';

export const getRmqMessage = <T extends object = object>(
  service: string,
  messageName: string,
): Cypress.Chainable<RmqMessage<T>> => {
  return cy
    .fixture(`${Cypress.env('PLATFORM')}/${service}-messages.json`)
    .then((fixtures) => {
      const rmqMessage = fixtures[messageName] as RmqMessage<T>;
      expect(rmqMessage, `no message found with ${messageName}`).to.exist;
      return rmqMessage;
    });
};
