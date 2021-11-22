import { Test, TestingModule } from '@nestjs/testing';

import { PartialExcept } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { IOidcIdentity, OidcSession } from '@fc/oidc';

import { TemplateNotFoundException } from './exceptions';
import { MailerService } from './mailer.service';
import { TemplateService } from './template.service';
import { MailjetTransport, StdoutTransport } from './transports';

jest.mock('./transports');

describe('MailerService', () => {
  let service: MailerService;

  const transportSendMock = jest.fn();

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

  const configServiceMock = { get: jest.fn() };
  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    trace: jest.fn(),
  };
  const templateServiceMock = {
    readFile: jest.fn(),
    render: jest.fn(),
    getFilePath: jest.fn(),
  };

  const MailjetTransportMock = MailjetTransport as unknown as jest.Mock;
  const StdoutTransportMock = StdoutTransport as unknown as jest.Mock;

  const mailjetMailerInstanceMock = {
    send: jest.fn(),
  };

  const stdoutMailerInstanceMock = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, LoggerService, MailerService, TemplateService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(TemplateService)
      .useValue(templateServiceMock)
      .compile();

    service = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set the logger context', () => {
    // setup
    const constructorName = 'MailerService';

    // expect
    expect(loggerServiceMock.setContext).toBeCalledTimes(1);
    expect(loggerServiceMock.setContext).toBeCalledWith(constructorName);
  });

  describe('onModuleInit', () => {
    beforeEach(() => {
      // clear the mocks from the onModuleInit call of the service instanciation
      jest.clearAllMocks();

      MailjetTransportMock.mockReturnValueOnce(mailjetMailerInstanceMock);
      StdoutTransportMock.mockReturnValueOnce(stdoutMailerInstanceMock);
    });

    it('should get the mailer mode from the config', () => {
      // setup
      const configName = 'Mailer';
      const configMock = { transport: 'logs' };
      configServiceMock.get.mockReturnValueOnce(configMock);

      // action
      service.onModuleInit();

      // expect
      expect(configServiceMock.get).toBeCalledTimes(1);
      expect(configServiceMock.get).toBeCalledWith(configName);
    });

    it('should instanciate the StdoutTransport with the logger instance if mailer is "logs"', () => {
      // setup
      const configMock = { transport: 'logs' };
      configServiceMock.get.mockReturnValueOnce(configMock);

      // action
      service.onModuleInit();

      // expect
      expect(StdoutTransportMock).toBeCalledTimes(1);
      expect(StdoutTransportMock).toBeCalledWith(loggerServiceMock);
    });

    it('should instanciate the MailjetTransport with the logger instance if mailer is "mailjet"', () => {
      // setup
      const configMock = { transport: 'mailjet' };
      configServiceMock.get.mockReturnValueOnce(configMock);

      // action
      service.onModuleInit();

      // expect
      expect(MailjetTransportMock).toBeCalledTimes(1);
      expect(MailjetTransportMock).toBeCalledWith(configServiceMock);
    });

    it('should throw an error if mailer is unknown', () => {
      // setup
      const configMock = { transport: 'pouet' };
      const error = new Error('Invalid mailer "pouet"');
      configServiceMock.get.mockReturnValueOnce(configMock);

      // action
      try {
        service.onModuleInit();
      } catch (e) {
        // expect
        expect(MailjetTransportMock).toBeCalledTimes(0);
        expect(StdoutTransportMock).toBeCalledTimes(0);

        expect(e).toBeInstanceOf(Error);
        expect(e.message).toStrictEqual(error.message);
      }
    });
  });

  describe('send', () => {
    beforeEach(() => {
      // clear the mocks from the onModuleInit call of the service instanciation
      jest.clearAllMocks();

      service['transport'] = { send: transportSendMock };
    });

    it('should return a promise', async () => {
      // action
      const result = service.send(emailParamsMock);

      // expect
      expect(result).toBeInstanceOf(Promise);
    });

    it('should call the transport "send" function with the mail parameters', async () => {
      // action
      await service.send(emailParamsMock);

      // expect
      expect(service['transport'].send).toHaveBeenCalledTimes(1);
      expect(service['transport'].send).toHaveBeenCalledWith(emailParamsMock);
    });

    it('should log an error if the transport throws', async () => {
      // setup
      const error = Error('oops');
      transportSendMock.mockImplementation(() => {
        throw error;
      });

      // action
      await service.send(emailParamsMock);

      // expect
      expect(loggerServiceMock.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('MailToSend', () => {
    const configName = 'Mailer';
    const fileName = 'file.ejs';
    const templateToRender = 'path/exists/and/is/last';
    const configMock = {
      templatePaths: [
        'path/does/not/exist',
        'path/does/exist',
        templateToRender,
      ],
    };
    const idpIdentityMock = {
      sub: 'some idpSub',
    } as PartialExcept<IOidcIdentity, 'sub'>;
    const spIdentityWithEmailMock = {
      sub: 'some spSub',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      given_name: 'Edward',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      family_name: 'TEACH',
      email: undefined,
    };
    const sessionDataMock: OidcSession = {
      idpId: '42',
      idpAcr: 'eidas3',
      idpName: 'my favorite Idp',
      idpIdentity: idpIdentityMock,

      spId: 'sp_id',
      spAcr: 'eidas3',
      spName: 'my great SP',
      spIdentity: spIdentityWithEmailMock,
    };
    const connectNotificationEmailParametersMock = {
      idpName: sessionDataMock.idpName,
      spName: sessionDataMock.spName,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      givenName: spIdentityWithEmailMock.given_name,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      familyName: spIdentityWithEmailMock.family_name,
      today: 'Le 01/01/2021 à 14:14',
    };
    const template = 'html file';
    const html = 'Hello world';

    beforeEach(async () => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
      jest.clearAllMocks();

      configServiceMock.get.mockReturnValueOnce(configMock);
    });

    it('should call the config', async () => {
      // GIVEN
      templateServiceMock.getFilePath.mockReturnValueOnce(
        configMock.templatePaths[2],
      );
      templateServiceMock.readFile.mockResolvedValueOnce(template);
      templateServiceMock.render.mockReturnValueOnce(html);

      // WHEN
      await service.mailToSend(
        fileName,
        connectNotificationEmailParametersMock,
      );

      // THEN
      expect(configServiceMock.get).toBeCalledTimes(1);
      expect(configServiceMock.get).toBeCalledWith(configName);
    });

    it('should call getFilePath from templateService', async () => {
      // GIVEN
      templateServiceMock.getFilePath.mockReturnValueOnce(templateToRender);
      templateServiceMock.readFile.mockResolvedValueOnce(template);
      templateServiceMock.render.mockReturnValueOnce(html);

      // WHEN
      await service.mailToSend(
        fileName,
        connectNotificationEmailParametersMock,
      );

      // THEN
      expect(templateServiceMock.getFilePath).toHaveBeenCalledTimes(1);
      expect(templateServiceMock.getFilePath).toHaveBeenCalledWith(
        fileName,
        configMock.templatePaths,
      );
    });

    it('should throw an error if the file path is not found', () => {
      // GIVEN
      templateServiceMock.getFilePath.mockReturnValueOnce(undefined);

      // WHEN / THEN
      expect(() =>
        service.mailToSend(fileName, connectNotificationEmailParametersMock),
      ).rejects.toThrow(TemplateNotFoundException);
    });

    it('should call readFile from templateService', async () => {
      // Given
      templateServiceMock.getFilePath.mockReturnValueOnce(templateToRender);
      templateServiceMock.readFile.mockResolvedValueOnce(template);
      templateServiceMock.render.mockReturnValueOnce(html);

      // WHEN
      await service.mailToSend(
        fileName,
        connectNotificationEmailParametersMock,
      );

      // THEN
      expect(templateServiceMock.readFile).toHaveBeenCalledTimes(1);
      expect(templateServiceMock.readFile).toHaveBeenCalledWith(
        templateToRender,
      );
    });

    it('should call render from templateService', async () => {
      // Given
      templateServiceMock.getFilePath.mockReturnValueOnce(templateToRender);
      templateServiceMock.readFile.mockResolvedValueOnce(template);
      templateServiceMock.render.mockReturnValueOnce(html);

      // WHEN
      await service.mailToSend(
        fileName,
        connectNotificationEmailParametersMock,
      );

      // THEN
      expect(templateServiceMock.render).toHaveBeenCalledTimes(1);
      expect(templateServiceMock.render).toHaveBeenCalledWith(
        template,
        connectNotificationEmailParametersMock,
      );
    });

    it('should return the html to render', async () => {
      // Given
      templateServiceMock.getFilePath.mockReturnValueOnce(
        configMock.templatePaths[2],
      );
      templateServiceMock.readFile.mockResolvedValueOnce(template);
      templateServiceMock.render.mockReturnValueOnce(html);

      // WHEN
      const result = await service.mailToSend(
        fileName,
        connectNotificationEmailParametersMock,
      );

      // THEN
      expect(result).toEqual(html);
    });
  });
});
