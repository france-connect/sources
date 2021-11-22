import * as mailjet from 'node-mailjet';

import { ConfigService } from '@fc/config';

import { MailjetTransport } from './mailjet-transport';

const configMock = {
  key: '',
  secret: '',
  options: {
    proxyUrl: 'https://',
  },
};

const configServiceMock = {
  get: jest.fn(),
};

const mailjetInstanceMock = {
  post: jest.fn(),
  request: jest.fn(),
};

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

const mailjetParamsMock = {
  Subject: 'subject',
  'HTML-part': 'body',
  FromEmail: 'from.email@fqdn.ext',
  FromName: 'from.name',
  Recipients: [
    {
      Email: 'recipient_1@fqdn.ext',
      Name: 'recipient_1',
    },
    {
      Email: 'recipient_2@fqdn.ext',
      Name: 'recipient_2',
    },
  ],
};

describe('MailjetTransport', () => {
  let service;

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    jest.clearAllMocks();

    configServiceMock.get.mockReturnValueOnce(configMock);
    jest.spyOn(mailjet, 'connect').mockReturnValueOnce(mailjetInstanceMock);

    service = new MailjetTransport(
      configServiceMock as unknown as ConfigService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should have called configServiceMock.get with "Mailer"', () => {
      // setup
      const configName = 'Mailer';

      // expect
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith(configName);
    });

    it('should have connect to mailjet API', () => {
      // expect
      expect(mailjet.connect).toHaveBeenCalledTimes(1);
      expect(mailjet.connect).toHaveBeenCalledWith(
        configMock.key,
        configMock.secret,
        configMock.options,
      );
    });
  });

  describe('send', () => {
    const originalMapParams = MailjetTransport['mapParams'];

    beforeEach(() => {
      MailjetTransport['mapParams'] = jest
        .fn()
        .mockReturnValueOnce(mailjetParamsMock);
      mailjetInstanceMock.post.mockReturnValueOnce(mailjetInstanceMock);
    });

    afterEach(() => {
      // restore
      MailjetTransport['mapParams'] = originalMapParams;
    });

    it('should return a promise', () => {
      // action
      const result = service.send(emailParamsMock);

      // expect
      expect(result).toBeInstanceOf(Promise);
    });

    it('should call the post method with "send" from mailjet instance', async () => {
      // setup
      const action = 'send';

      // action
      await service.send(emailParamsMock);

      // expect
      expect(mailjetInstanceMock.post).toHaveBeenCalledTimes(1);
      expect(mailjetInstanceMock.post).toHaveBeenCalledWith(action);
    });

    it('should call mapParams method with emailParamsMock', async () => {
      // action
      await service.send(emailParamsMock);

      // expect
      expect(MailjetTransport['mapParams']).toHaveBeenCalledTimes(1);
      expect(MailjetTransport['mapParams']).toHaveBeenCalledWith(
        emailParamsMock,
      );
    });

    it('should call the request method with mapped params from the post result from mailjet instance', async () => {
      // action
      await service.send(emailParamsMock);

      // expect
      expect(mailjetInstanceMock.request).toHaveBeenCalledTimes(1);
      expect(mailjetInstanceMock.request).toHaveBeenCalledWith(
        mailjetParamsMock,
      );
    });
  });

  describe('mapParams', () => {
    it('should map the params for mailjet', () => {
      // action
      const result = MailjetTransport['mapParams'](emailParamsMock);

      // setup
      expect(result).toEqual(mailjetParamsMock);
    });
  });
});
