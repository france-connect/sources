import { LoggerService } from '@fc/logger';

import { StdoutTransport } from './stdout-transport';

const emailParamsMock = {
  subject: 'subject',
  body: 'body',
  from: {
    email: 'from.email@fqdn.ext',
    name: 'from.name',
  },
  to: [
    {
      email: 'recipient_1@fqdn.ext',
      name: 'recipient_1',
    },
    {
      email: 'recipient_2@fqdn.ext',
      name: 'recipient_2',
    },
  ],
};

const loggerServiceMock = {
  debug: jest.fn(),
  trace: jest.fn(),
};

describe('StdoutTransport', () => {
  let service;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();

    service = new StdoutTransport(
      loggerServiceMock as unknown as LoggerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('send', () => {
    it('should return a promise', () => {
      // action
      const result = service.send(emailParamsMock);

      // expect
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolves to "true"', async () => {
      // action
      const result = await service.send(emailParamsMock);

      // expect
      expect(result).toStrictEqual(true);
    });

    it('should call the logger with the mails params', async () => {
      // setup
      const log = `Printing mail to console: ${JSON.stringify(
        emailParamsMock,
        null,
        2,
      )}`;

      // action
      await service.send(emailParamsMock);

      // expect
      expect(loggerServiceMock.debug).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.debug).toHaveBeenCalledWith(log);
    });
  });
});
