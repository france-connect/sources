import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

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

const loggerServiceMock = getLoggerMock();

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
      // When
      const result = service.send(emailParamsMock);

      // Then
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolves to "true"', async () => {
      // When
      const result = await service.send(emailParamsMock);

      // Then
      expect(result).toStrictEqual(true);
    });

    it('should call the logger with the mails params', async () => {
      // When
      await service.send(emailParamsMock);

      // Then
      expect(loggerServiceMock.info).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.info).toHaveBeenCalledWith(
        emailParamsMock,
        'Printing mail to console',
      );
    });
  });
});
