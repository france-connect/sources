import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable, Type } from '@nestjs/common';

import {
  objectPropertiesCamelToPascal,
  objectPropertiesPascalToCamel,
} from '@fc/common';
import { ConfigService } from '@fc/config';

import {
  HttpOtrsClientConfigDto,
  OtrsErrorResponseDto,
  OtrsRawArticleDto,
  OtrsRawDynamicFieldDto,
  OtrsSessionCreateResponseDto,
  OtrsTicketGetResponseDto,
  OtrsTicketSearchResponseDto,
  OtrsTicketUpdateRawResponseDto,
} from '../dto';
import { OtrsEndpoint } from '../enums';
import {
  HttpOtrsClientBaseException,
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
  OtrsRawDynamicFieldInterface,
  OtrsTicketInterface,
  OtrsTicketUpdateResponseInterface,
} from '../interfaces';

@Injectable()
export class HttpOtrsClientService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async createSession(): Promise<string> {
    const { userLogin, password } =
      this.configService.get<HttpOtrsClientConfigDto>('HttpOtrsClient');

    const data = await this.post(
      OtrsEndpoint.SESSION_CREATE,
      { UserLogin: userLogin, Password: password },
      HttpOtrsClientCreateSessionFailedException,
      OtrsSessionCreateResponseDto,
    );

    return data.SessionID;
  }

  async searchTickets(
    SessionID: string,
    newerDate: string,
    olderDate: string,
  ): Promise<string[]> {
    const data = await this.post(
      OtrsEndpoint.TICKET_SEARCH,
      {
        SessionID,
        TicketCreateTimeNewerDate: newerDate,
        TicketCreateTimeOlderDate: olderDate,
      },
      HttpOtrsClientSearchTicketsFailedException,
      OtrsTicketSearchResponseDto,
    );

    return data.TicketID;
  }

  async getTicket(
    SessionID: string,
    ticketId: number,
  ): Promise<OtrsTicketInterface> {
    const data = await this.post(
      OtrsEndpoint.TICKET_GET,
      { SessionID, TicketID: ticketId, DynamicFields: 1, AllArticles: 1 },
      HttpOtrsClientGetTicketFailedException,
      OtrsTicketGetResponseDto,
    );

    const { TicketID, TicketNumber, Title, DynamicField, Article } =
      data.Ticket[0];

    const dynamicField = DynamicField.map((field) =>
      objectPropertiesPascalToCamel<
        OtrsDynamicFieldInterface,
        OtrsRawDynamicFieldDto
      >(field),
    );

    const article = Article.map((item) =>
      objectPropertiesPascalToCamel<OtrsArticleInterface, OtrsRawArticleDto>(
        item,
      ),
    );

    return {
      ticketId: TicketID,
      ticketNumber: TicketNumber,
      title: Title,
      dynamicField,
      article,
    };
  }

  async updateTicket(
    SessionID: string,
    ticketId: number,
    dynamicFields: OtrsDynamicFieldInterface[],
  ): Promise<OtrsTicketUpdateResponseInterface> {
    const DynamicField = dynamicFields.map((field) =>
      objectPropertiesCamelToPascal<
        OtrsRawDynamicFieldInterface,
        OtrsDynamicFieldInterface
      >(field),
    );

    const data = await this.post(
      OtrsEndpoint.TICKET_UPDATE,
      { SessionID, DynamicField, TicketID: ticketId },
      HttpOtrsClientUpdateTicketFailedException,
      OtrsTicketUpdateRawResponseDto,
    );

    return {
      ticketId: data.TicketID,
      ticketNumber: data.TicketNumber,
    };
  }

  private async post<T extends OtrsErrorResponseDto>(
    endpoint: OtrsEndpoint,
    payload: unknown,
    BusinessException: Type<HttpOtrsClientBaseException>,
    DtoClass: Type<T>,
  ): Promise<T> {
    const { baseUrl } =
      this.configService.get<HttpOtrsClientConfigDto>('HttpOtrsClient');
    const url = `${baseUrl}${endpoint}`;

    let rawData: unknown;

    try {
      ({ data: rawData } = await lastValueFrom(
        this.httpService.post<unknown>(url, payload),
      ));
    } catch (error) {
      throw new HttpOtrsClientHttpFailureException(error);
    }

    const data = plainToInstance(DtoClass, rawData);

    try {
      await validateOrReject(data);
    } catch (validationErrors) {
      const message = (validationErrors as ValidationError[])
        .map((e) => e.toString())
        .join(', ');
      throw new HttpOtrsClientInvalidResponseException(message);
    }

    if (data.Error) {
      throw new BusinessException(data.Error.ErrorMessage);
    }

    return data;
  }
}
