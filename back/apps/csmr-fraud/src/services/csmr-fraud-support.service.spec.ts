import { Attachment } from 'nodemailer/lib/mailer';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { generateCSVContent } from '@fc/csv';
import { MailerService } from '@fc/mailer';

import { EmailsTemplates } from '../enums';
import {
  SecurityTicketDataInterface,
  TicketTracksDataInterface,
} from '../interfaces';
import { getTracksByIdpName, getTracksBySpName } from '../utils';
import { CsmrFraudSupportService } from './csmr-fraud-support.service';

jest.mock('@fc/csv/helpers');
jest.mock('../utils');

describe('CsmrFraudSupportService', () => {
  let service: CsmrFraudSupportService;

  const configMock = {
    get: jest.fn(),
  };

  const mailerServiceMock = {
    send: jest.fn(),
    mailToSend: jest.fn(),
  } as unknown as MailerService;

  const tracksMock = Symbol('tracks') as unknown as TicketTracksDataInterface[];

  const ticketDataMock: SecurityTicketDataInterface = {
    fraudCaseId: 'fraudCaseIdMock',
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
    error: '',
    total: 0,
    tracks: tracksMock,
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

  const attachmentsMock = Symbol('attachments') as unknown as Attachment[];

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
      service['getMailAttachments'] = jest
        .fn()
        .mockReturnValue(attachmentsMock);
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

    it('should call getMailAttachments', async () => {
      // When
      await service.createSecurityTicket(ticketDataMock);

      // Then
      expect(service['getMailAttachments']).toHaveBeenCalledTimes(1);
      expect(service['getMailAttachments']).toHaveBeenCalledWith(tracksMock);
    });

    it('should call sendFraudMail', async () => {
      // When
      await service.createSecurityTicket(ticketDataMock);

      // Then
      expect(service['sendFraudMail']).toHaveBeenCalledTimes(1);
      expect(service['sendFraudMail']).toHaveBeenCalledWith(
        fromMock,
        bodyMock,
        attachmentsMock,
      );
    });
  });

  describe('sendFraudMail', () => {
    it('should call send method from mailerService', async () => {
      // When
      await service['sendFraudMail'](fromMock, bodyMock, attachmentsMock);

      // Then
      expect(mailerServiceMock.send).toHaveBeenCalledTimes(1);
      expect(mailerServiceMock.send).toHaveBeenCalledWith({
        from: fromMock,
        to: toMock,
        replyTo: fromMock,
        subject: subjectMock,
        body: bodyMock,
        attachments: attachmentsMock,
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

  describe('getMailAttachments', () => {
    const sp1TracksMock = Symbol(
      'sp1TracksMock',
    ) as unknown as Partial<TicketTracksDataInterface>[];
    const sp2TracksMock = Symbol(
      'sp2TracksMock',
    ) as unknown as Partial<TicketTracksDataInterface>[];
    const idp1TracksMock = Symbol(
      'idp1TracksMock',
    ) as unknown as Partial<TicketTracksDataInterface>[];

    const tracksBySpNameMock = { sp1: sp1TracksMock, sp2: sp2TracksMock };
    const tracksByIdpNameMock = { idp1: idp1TracksMock };
    const csvContent = Symbol('csvContent') as unknown as string;

    beforeEach(() => {
      jest.mocked(getTracksBySpName).mockReturnValue(tracksBySpNameMock);
      jest.mocked(getTracksByIdpName).mockReturnValue(tracksByIdpNameMock);
      jest.mocked(generateCSVContent).mockReturnValue(csvContent);
    });
    it('should return empty list ', () => {
      // When
      const result = service['getMailAttachments']([]);

      // Then
      expect(result).toHaveLength(0);
    });
    it('should call getTracksBySpName', () => {
      // When
      service['getMailAttachments'](tracksMock);

      // Then
      expect(getTracksBySpName).toHaveBeenCalledTimes(1);
      expect(getTracksBySpName).toHaveBeenCalledWith(tracksMock);
    });
    it('should call getTracksByIdpName', () => {
      // When
      service['getMailAttachments'](tracksMock);

      // Then
      expect(getTracksByIdpName).toHaveBeenCalledTimes(1);
      expect(getTracksByIdpName).toHaveBeenCalledWith(tracksMock);
    });
    it('should call generateCSVContent', () => {
      // When
      service['getMailAttachments'](tracksMock);

      // Then
      expect(generateCSVContent).toHaveBeenCalledTimes(3);
      expect(generateCSVContent).toHaveBeenNthCalledWith(1, sp1TracksMock);
      expect(generateCSVContent).toHaveBeenNthCalledWith(2, sp2TracksMock);
      expect(generateCSVContent).toHaveBeenNthCalledWith(3, idp1TracksMock);
    });
    it('should return attachments', () => {
      // Given
      const expectedAttachments: Attachment[] = [
        {
          filename: `sp1_connexions.csv`,
          content: csvContent,
          contentType: 'text/csv',
        },
        {
          filename: `sp2_connexions.csv`,
          content: csvContent,
          contentType: 'text/csv',
        },
        {
          filename: `idp1_connexions.csv`,
          content: csvContent,
          contentType: 'text/csv',
        },
      ];

      // When
      const result = service['getMailAttachments'](tracksMock);

      // Then
      expect(result).toEqual(expectedAttachments);
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
