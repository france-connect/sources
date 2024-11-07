import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { MailerService } from '@fc/mailer';

import { EmailsTemplates } from '../enums';
import { CsmrFraudSupportService } from './csmr-fraud-support.service';

describe('CsmrFraudSupportService', () => {
  let service: CsmrFraudSupportService;

  const configMock = {
    get: jest.fn(),
  };

  const mailerServiceMock = {
    send: jest.fn(),
    mailToSend: jest.fn(),
  } as unknown as MailerService;

  const ticketDataMock = {
    givenName: 'firstname',
    familyName: 'lastname',
    birthdate: 'birthdate',
    birthplace: 'birthplace',
    birthcountry: 'birthcountry',
    contactEmail: 'email@mock.fr',
    idpEmail: 'email@fi.fr',
    authenticationEventId: '1a344d7d-fb1f-432f-99df-01b374c93687',
    fraudSurveyOrigin: 'fraudSurveyOriginMock',
    comment: 'commentMock',
    phoneNumber: '0678912345',
  };

  const fromMock = {
    email: 'email@mock.fr',
    name: 'firstname lastname',
  };

  const fraudEmailAddressMock = 'mail@otrs.com';

  const fraudEmailRecipientMock = 'otrs';

  const subjectMock = 'subject';

  const toMock = [
    {
      email: fraudEmailAddressMock,
      name: fraudEmailRecipientMock,
    },
  ];

  const bodyMock = 'myWonderful template content';

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, MailerService, CsmrFraudSupportService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(MailerService)
      .useValue(mailerServiceMock)
      .compile();

    service = module.get<CsmrFraudSupportService>(CsmrFraudSupportService);

    configMock.get.mockReturnValue({
      fraudEmailAddress: fraudEmailAddressMock,
      fraudEmailRecipient: fraudEmailRecipientMock,
      fraudEmailSubject: subjectMock,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSecurityTicket', () => {
    beforeEach(() => {
      service['getMailFrom'] = jest.fn().mockReturnValue(fromMock);
      service['getMailBodyContent'] = jest.fn().mockResolvedValue(bodyMock);
      service['sendFraudMail'] = jest.fn();
    });

    it('should call getMailFrom', async () => {
      // Given
      const { givenName, familyName, contactEmail } = ticketDataMock;

      // When
      await service.createSecurityTicket(ticketDataMock);

      // Then
      expect(service['getMailFrom']).toHaveBeenCalledTimes(1);
      expect(service['getMailFrom']).toHaveBeenCalledWith(
        givenName,
        familyName,
        contactEmail,
      );
    });

    it('should call getMailBodyContent', async () => {
      // When
      await service.createSecurityTicket(ticketDataMock);

      // Then
      expect(service['getMailBodyContent']).toHaveBeenCalledTimes(1);
      expect(service['getMailBodyContent']).toHaveBeenCalledWith(
        ticketDataMock,
      );
    });

    it('should call sendFraudMail', async () => {
      // When
      await service.createSecurityTicket(ticketDataMock);

      // Then
      expect(service['sendFraudMail']).toHaveBeenCalledTimes(1);
      expect(service['sendFraudMail']).toHaveBeenCalledWith(fromMock, bodyMock);
    });
  });

  describe('sendFraudMail', () => {
    it('should call send method from mailerService', async () => {
      // When
      await service['sendFraudMail'](fromMock, bodyMock);

      // Then
      expect(mailerServiceMock.send).toHaveBeenCalledTimes(1);
      expect(mailerServiceMock.send).toHaveBeenCalledWith({
        from: fromMock,
        to: toMock,
        replyTo: fromMock,
        subject: subjectMock,
        body: bodyMock,
      });
    });
  });

  describe('getMailBodyContent', () => {
    it('should call mailToSend ', async () => {
      // When
      await service['getMailBodyContent'](ticketDataMock);

      // Then
      expect(mailerServiceMock.mailToSend).toHaveBeenCalledTimes(1);
      expect(mailerServiceMock.mailToSend).toHaveBeenCalledWith(
        EmailsTemplates.FRAUD_FORM_EMAIL,
        ticketDataMock,
      );
    });
    it('should return html content', async () => {
      // Given
      jest.mocked(mailerServiceMock.mailToSend).mockResolvedValueOnce(bodyMock);

      // When
      const result = await service['getMailBodyContent'](ticketDataMock);

      // Then
      expect(result).toEqual(bodyMock);
    });
  });

  describe('getMailFrom', () => {
    it('should return from object', () => {
      // Given
      const { givenName, familyName, contactEmail } = ticketDataMock;

      // When
      const result = service['getMailFrom'](
        givenName,
        familyName,
        contactEmail,
      );

      // Then
      expect(result).toEqual(fromMock);
    });
  });
});
