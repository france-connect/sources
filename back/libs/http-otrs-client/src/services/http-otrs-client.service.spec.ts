import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { of, throwError } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import {
  objectPropertiesCamelToPascal,
  objectPropertiesPascalToCamel,
} from '@fc/common';
import { ConfigService } from '@fc/config';

import {
  HttpOtrsClientConfigDto,
  OtrsSessionCreateResponseDto,
  OtrsTicketGetResponseDto,
  OtrsTicketSearchResponseDto,
  OtrsTicketUpdateRawResponseDto,
} from '../dto';
import { OtrsEndpoint } from '../enums';
import {
  HttpOtrsClientCreateSessionFailedException,
  HttpOtrsClientGetTicketFailedException,
  HttpOtrsClientHttpFailureException,
  HttpOtrsClientInvalidResponseException,
  HttpOtrsClientSearchTicketsFailedException,
  HttpOtrsClientUpdateTicketFailedException,
} from '../exceptions';
import {
  OtrsArticleInterface,
  OtrsDynamicFieldInterface,
  OtrsRawArticleInterface,
  OtrsRawDynamicFieldInterface,
} from '../interfaces';
import { HttpOtrsClientService } from './http-otrs-client.service';

jest.mock('@fc/common');
jest.mock('class-transformer', () => ({
  ...jest.requireActual('class-transformer'),
  plainToInstance: jest.fn(),
}));
jest.mock('class-validator', () => ({
  ...jest.requireActual('class-validator'),
  validateOrReject: jest.fn(),
}));

describe('HttpOtrsClientService', () => {
  let service: HttpOtrsClientService;

  const httpServiceMock = {
    post: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const plainToInstanceMock = jest.mocked(plainToInstance);
  const validateOrRejectMock = jest.mocked(validateOrReject);
  const objectPropertiesPascalToCamelMock = jest.mocked(
    objectPropertiesPascalToCamel,
  );
  const objectPropertiesCamelToPascalMock = jest.mocked(
    objectPropertiesCamelToPascal,
  );

  const configMock: HttpOtrsClientConfigDto = {
    baseUrl: 'https://otrs.example.com',
    userLogin: 'user',
    password: 'pass',
  };

  const errorMessageMock = 'Invalid credentials';
  const errorCodeMock = 'AuthFail';

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpOtrsClientService, HttpService, ConfigService],
    })
      .overrideProvider(HttpService)
      .useValue(httpServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<HttpOtrsClientService>(HttpOtrsClientService);

    configServiceMock.get.mockReturnValue(configMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSession', () => {
    const sessionIdMock = 'session-abc-123';

    beforeEach(() => {
      service['post'] = jest
        .fn()
        .mockResolvedValue({ SessionID: sessionIdMock });
    });

    it('should call post with SESSION_CREATE endpoint and credentials', async () => {
      // When
      await service.createSession();

      // Then
      expect(service['post']).toHaveBeenCalledExactlyOnceWith(
        OtrsEndpoint.SESSION_CREATE,
        { UserLogin: configMock.userLogin, Password: configMock.password },
        HttpOtrsClientCreateSessionFailedException,
        OtrsSessionCreateResponseDto,
      );
    });

    it('should return the SessionID', async () => {
      // When
      const result = await service.createSession();

      // Then
      expect(result).toBe(sessionIdMock);
    });
  });

  describe('searchTickets', () => {
    const sessionIdMock = 'session-xyz';
    const newerDateMock = '2024-01-01 00:00:00';
    const olderDateMock = '2024-01-31 23:59:59';
    const ticketIdsMock = ['101', '202', '303'];

    beforeEach(() => {
      service['post'] = jest
        .fn()
        .mockResolvedValue({ TicketID: ticketIdsMock });
    });

    it('should call post with TICKET_SEARCH endpoint and parameters', async () => {
      // When
      await service.searchTickets(sessionIdMock, newerDateMock, olderDateMock);

      // Then
      expect(service['post']).toHaveBeenCalledExactlyOnceWith(
        OtrsEndpoint.TICKET_SEARCH,
        {
          SessionID: sessionIdMock,
          TicketCreateTimeNewerDate: newerDateMock,
          TicketCreateTimeOlderDate: olderDateMock,
        },
        HttpOtrsClientSearchTicketsFailedException,
        OtrsTicketSearchResponseDto,
      );
    });

    it('should return the list of ticket IDs', async () => {
      // When
      const result = await service.searchTickets(
        sessionIdMock,
        newerDateMock,
        olderDateMock,
      );

      // Then
      expect(result).toBe(ticketIdsMock);
    });
  });

  describe('getTicket', () => {
    const sessionIdMock = 'session-xyz';
    const ticketIdMock = 42;

    const rawDynamicFieldMock: OtrsRawDynamicFieldInterface = {
      Name: 'FieldOne',
      Value: 'ValueOne',
    };
    const rawArticleMock: OtrsRawArticleInterface = {
      ArticleID: 1,
      ArticleNumber: 100,
      Subject: 'Test subject',
      Body: 'Test body',
      ContentType: 'text/plain',
      MimeType: 'text/plain',
      Charset: 'UTF-8',
      ContentCharset: 'UTF-8',
      From: 'client@example.com',
      To: 'support@example.com',
      Cc: null,
      Bcc: null,
      ReplyTo: null,
      InReplyTo: null,
      References: null,
      MessageID: 'msg-001',
      IncomingTime: 1774345991,
      SenderType: 'agent',
      SenderTypeID: '1',
      IsVisibleForCustomer: 1,
      TicketID: 1,
      CommunicationChannelID: 1,
      TimeUnit: 0,
      CreateTime: '2026-03-24 09:53:11',
      CreateBy: 1,
      ChangeTime: '2026-03-24 09:53:11',
      ChangeBy: 1,
    };
    const rawTicketMock = {
      TicketID: ticketIdMock,
      TicketNumber: 'TN-001',
      Title: 'Test ticket',
      DynamicField: [rawDynamicFieldMock],
      Article: [rawArticleMock],
    };

    const mappedDynamicFieldMock: OtrsDynamicFieldInterface = {
      name: 'FieldOne',
      value: 'ValueOne',
    };
    const mappedArticleMock: OtrsArticleInterface = {
      articleId: 1,
      articleNumber: 100,
      subject: 'Test subject',
      body: 'Test body',
      contentType: 'text/plain',
      mimeType: 'text/plain',
      charset: 'UTF-8',
      contentCharset: 'UTF-8',
      from: 'client@example.com',
      to: 'support@example.com',
      cc: null,
      bcc: null,
      replyTo: null,
      inReplyTo: null,
      references: null,
      messageId: 'msg-001',
      incomingTime: 1774345991,
      senderType: 'agent',
      senderTypeId: '1',
      isVisibleForCustomer: 1,
      ticketId: 1,
      communicationChannelId: 1,
      timeUnit: 0,
      createTime: '2026-03-24 09:53:11',
      createBy: 1,
      changeTime: '2026-03-24 09:53:11',
      changeBy: 1,
    };

    beforeEach(() => {
      service['post'] = jest
        .fn()
        .mockResolvedValue({ Ticket: [rawTicketMock] });
      objectPropertiesPascalToCamelMock
        .mockReturnValueOnce(mappedDynamicFieldMock)
        .mockReturnValueOnce(mappedArticleMock);
    });

    it('should call post with TICKET_GET endpoint and parameters', async () => {
      // When
      await service.getTicket(sessionIdMock, ticketIdMock);

      // Then
      expect(service['post']).toHaveBeenCalledExactlyOnceWith(
        OtrsEndpoint.TICKET_GET,
        {
          SessionID: sessionIdMock,
          TicketID: ticketIdMock,
          DynamicFields: 1,
          AllArticles: 1,
        },
        HttpOtrsClientGetTicketFailedException,
        OtrsTicketGetResponseDto,
      );
    });

    it('should call objectPropertiesPascalToCamel for each dynamic field and article', async () => {
      // When
      await service.getTicket(sessionIdMock, ticketIdMock);

      // Then
      expect(objectPropertiesPascalToCamelMock).toHaveBeenCalledTimes(2);
      expect(objectPropertiesPascalToCamelMock).toHaveBeenCalledWith(
        rawDynamicFieldMock,
      );
      expect(objectPropertiesPascalToCamelMock).toHaveBeenCalledWith(
        rawArticleMock,
      );
    });

    it('should return the mapped ticket', async () => {
      // When
      const result = await service.getTicket(sessionIdMock, ticketIdMock);

      // Then
      expect(result).toEqual({
        ticketId: rawTicketMock.TicketID,
        ticketNumber: rawTicketMock.TicketNumber,
        title: rawTicketMock.Title,
        dynamicField: [mappedDynamicFieldMock],
        article: [mappedArticleMock],
      });
    });
  });

  describe('updateTicket', () => {
    const sessionIdMock = 'session-xyz';
    const ticketIdMock = 42;

    const dynamicFieldsMock: OtrsDynamicFieldInterface[] = [
      { name: 'field1', value: 'value1' },
    ];
    const pascalFieldMock: OtrsRawDynamicFieldInterface = {
      Name: 'field1',
      Value: 'value1',
    };

    beforeEach(() => {
      service['post'] = jest
        .fn()
        .mockResolvedValue({ TicketID: ticketIdMock, TicketNumber: 'TN-001' });
      objectPropertiesCamelToPascalMock.mockReturnValue(pascalFieldMock);
    });

    it('should call objectPropertiesCamelToPascal for each dynamic field', async () => {
      // When
      await service.updateTicket(
        sessionIdMock,
        ticketIdMock,
        dynamicFieldsMock,
      );

      // Then
      expect(objectPropertiesCamelToPascalMock).toHaveBeenCalledTimes(1);
      expect(objectPropertiesCamelToPascalMock).toHaveBeenCalledWith(
        dynamicFieldsMock[0],
      );
    });

    it('should call post with TICKET_UPDATE endpoint and PascalCase dynamic fields', async () => {
      // When
      await service.updateTicket(
        sessionIdMock,
        ticketIdMock,
        dynamicFieldsMock,
      );

      // Then
      expect(service['post']).toHaveBeenCalledExactlyOnceWith(
        OtrsEndpoint.TICKET_UPDATE,
        {
          SessionID: sessionIdMock,
          DynamicField: [pascalFieldMock],
          TicketID: ticketIdMock,
        },
        HttpOtrsClientUpdateTicketFailedException,
        OtrsTicketUpdateRawResponseDto,
      );
    });

    it('should return the mapped update response', async () => {
      // When
      const result = await service.updateTicket(
        sessionIdMock,
        ticketIdMock,
        dynamicFieldsMock,
      );

      // Then
      expect(result).toEqual({
        ticketId: ticketIdMock,
        ticketNumber: 'TN-001',
      });
    });
  });

  describe('post', () => {
    const endpointMock = OtrsEndpoint.SESSION_CREATE;
    const payloadMock = { UserLogin: 'user', Password: 'pass' };
    const rawDataMock = { SessionID: 'sid' };
    const instancedDataMock = { SessionID: 'sid', Error: undefined };

    beforeEach(() => {
      httpServiceMock.post.mockReturnValue(of({ data: rawDataMock }));
      plainToInstanceMock.mockReturnValue(instancedDataMock as never);
      validateOrRejectMock.mockResolvedValue(undefined);
    });

    it('should call configService.get with HttpOtrsClient key', async () => {
      // When
      await service['post'](
        endpointMock,
        payloadMock,
        HttpOtrsClientCreateSessionFailedException,
        OtrsSessionCreateResponseDto,
      );

      // Then
      expect(configServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        'HttpOtrsClient',
      );
    });

    it('should call httpService.post with the full URL and payload', async () => {
      // When
      await service['post'](
        endpointMock,
        payloadMock,
        HttpOtrsClientCreateSessionFailedException,
        OtrsSessionCreateResponseDto,
      );

      // Then
      expect(httpServiceMock.post).toHaveBeenCalledExactlyOnceWith(
        `${configMock.baseUrl}${endpointMock}`,
        payloadMock,
      );
    });

    it('should call plainToInstance with the DtoClass and raw response data', async () => {
      // When
      await service['post'](
        endpointMock,
        payloadMock,
        HttpOtrsClientCreateSessionFailedException,
        OtrsSessionCreateResponseDto,
      );

      // Then
      expect(plainToInstanceMock).toHaveBeenCalledExactlyOnceWith(
        OtrsSessionCreateResponseDto,
        rawDataMock,
      );
    });

    it('should call validateOrReject with the instanced data', async () => {
      // When
      await service['post'](
        endpointMock,
        payloadMock,
        HttpOtrsClientCreateSessionFailedException,
        OtrsSessionCreateResponseDto,
      );

      // Then
      expect(validateOrRejectMock).toHaveBeenCalledExactlyOnceWith(
        instancedDataMock,
      );
    });

    it('should return the instanced data when no error is present', async () => {
      // When
      const result = await service['post'](
        endpointMock,
        payloadMock,
        HttpOtrsClientCreateSessionFailedException,
        OtrsSessionCreateResponseDto,
      );

      // Then
      expect(result).toBe(instancedDataMock);
    });

    it('should throw the provided BusinessException when response contains an error', async () => {
      // Given
      const instancedWithErrorMock = {
        Error: { ErrorMessage: errorMessageMock, ErrorCode: errorCodeMock },
      };
      plainToInstanceMock.mockReturnValue(instancedWithErrorMock as never);

      // When / Then
      await expect(
        service['post'](
          endpointMock,
          payloadMock,
          HttpOtrsClientCreateSessionFailedException,
          OtrsSessionCreateResponseDto,
        ),
      ).rejects.toThrow(HttpOtrsClientCreateSessionFailedException);
    });

    it('should throw with the error message from the response', async () => {
      // Given
      const instancedWithErrorMock = {
        Error: { ErrorMessage: errorMessageMock, ErrorCode: errorCodeMock },
      };
      plainToInstanceMock.mockReturnValue(instancedWithErrorMock as never);

      // When / Then
      await expect(
        service['post'](
          endpointMock,
          payloadMock,
          HttpOtrsClientCreateSessionFailedException,
          OtrsSessionCreateResponseDto,
        ),
      ).rejects.toThrow(errorMessageMock);
    });

    it('should throw HttpOtrsClientHttpFailureException on network error', async () => {
      // Given
      httpServiceMock.post.mockReturnValue(
        throwError(() => new Error('ECONNREFUSED')),
      );

      // When / Then
      await expect(
        service['post'](
          endpointMock,
          payloadMock,
          HttpOtrsClientCreateSessionFailedException,
          OtrsSessionCreateResponseDto,
        ),
      ).rejects.toThrow(HttpOtrsClientHttpFailureException);
    });

    it('should throw HttpOtrsClientInvalidResponseException when validateOrReject fails', async () => {
      // Given
      const validationErrorMock = [
        { toString: () => 'property SessionID must be a string' },
      ];
      validateOrRejectMock.mockRejectedValue(validationErrorMock);

      // When / Then
      await expect(
        service['post'](
          endpointMock,
          payloadMock,
          HttpOtrsClientCreateSessionFailedException,
          OtrsSessionCreateResponseDto,
        ),
      ).rejects.toThrow(HttpOtrsClientInvalidResponseException);
    });

    it('should throw HttpOtrsClientInvalidResponseException with the joined validation error messages', async () => {
      // Given
      const errorOneMock = 'property SessionID must be a string';
      const errorTwoMock = 'property Error must be an object';
      const validationErrorMock = [
        { toString: () => errorOneMock },
        { toString: () => errorTwoMock },
      ];
      validateOrRejectMock.mockRejectedValue(validationErrorMock);

      // When / Then
      await expect(
        service['post'](
          endpointMock,
          payloadMock,
          HttpOtrsClientCreateSessionFailedException,
          OtrsSessionCreateResponseDto,
        ),
      ).rejects.toThrow(`${errorOneMock}, ${errorTwoMock}`);
    });
  });
});
